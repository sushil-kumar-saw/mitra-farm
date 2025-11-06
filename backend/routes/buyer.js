import express from 'express';
import mongoose from 'mongoose';
import { verifyToken } from '../middleware/authMiddleware.js';
import WasteListing from '../models/WasteListing.js';
import Buyer from '../models/Buyer.js';
import Purchase from '../models/Purchase.js';
import Inquiry from '../models/Inquiry.js';
import User from '../models/user.js';

const router = express.Router();

// Helper function to convert string to ObjectId
const toObjectId = (id) => {
  if (!id) return id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return id;
};

// All buyer routes require authentication
router.use(verifyToken);

// Get buyer dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const buyerId = toObjectId(req.user);
    
    // Get buyer profile
    const buyer = await Buyer.findOne({ userId: buyerId });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found' });
    }

    // Get purchase statistics
    const purchases = await Purchase.find({ buyerId });
    const totalPurchases = purchases.length;
    const activeTransactions = purchases.filter(p => ['Pending', 'Confirmed'].includes(p.status)).length;
    
    // Calculate total carbon saved from purchases
    const carbonSaved = purchases.reduce((total, purchase) => {
      const co2Match = purchase.carbonSaving?.match(/([\d.]+)/);
      if (co2Match) {
        return total + parseFloat(co2Match[1]);
      }
      return total;
    }, 0);

    res.json({
      success: true,
      stats: {
        totalPurchases,
        carbonSaved: Math.round(carbonSaved),
        activeTransactions
      }
    });
  } catch (err) {
    console.error('Error fetching buyer stats:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get buyer's purchases
router.get('/purchases', async (req, res) => {
  try {
    const buyerId = toObjectId(req.user);
    const purchases = await Purchase.find({ buyerId })
      .populate('listingId')
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, purchases });
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Purchase a listing
router.post('/purchases', async (req, res) => {
  try {
    const buyerId = toObjectId(req.user);
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ success: false, message: 'Listing ID is required' });
    }

    const listing = await WasteListing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'Listing is not available for purchase' });
    }

    // Check if already purchased
    const existingPurchase = await Purchase.findOne({ buyerId, listingId });
    if (existingPurchase) {
      return res.status(400).json({ success: false, message: 'You have already purchased this listing' });
    }

    // Calculate total amount (simplified - extract price from string)
    const priceMatch = listing.price.match(/₹([\d,]+)/);
    const quantityMatch = listing.quantity.match(/([\d.]+)/);
    let totalAmount = 0;
    
    if (priceMatch && quantityMatch) {
      const pricePerUnit = parseFloat(priceMatch[1].replace(/,/g, ''));
      const quantity = parseFloat(quantityMatch[1]);
      totalAmount = pricePerUnit * quantity;
    }

    // Create purchase
    const purchase = new Purchase({
      buyerId,
      listingId: listing._id,
      farmerId: listing.farmerId,
      wasteType: listing.wasteType,
      quantity: listing.quantity,
      price: listing.price,
      totalAmount,
      carbonSaving: listing.carbonSaving || listing.co2Footprint,
      status: 'Pending'
    });

    await purchase.save();

    // Update listing status to Sold
    listing.status = 'Sold';
    await listing.save();

    await purchase.populate('listingId');
    await purchase.populate('farmerId', 'name email');

    res.status(201).json({ success: true, purchase });
  } catch (err) {
    console.error('Error creating purchase:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get marketplace listings (all active listings)
router.get('/marketplace', async (req, res) => {
  try {
    const listings = await WasteListing.find({ status: 'Active' })
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 });
    
    // Format listings to ensure all required fields are present
    const formattedListings = listings.map(listing => {
      // Convert image path from database format to frontend format
      let imagePath = listing.image;
      if (imagePath && typeof imagePath === 'string') {
        if (imagePath.includes('./public/images/')) {
          imagePath = imagePath.replace('./public/images/', '/images/');
        } else if (imagePath.includes('public/images/')) {
          imagePath = imagePath.replace('public/images/', '/images/');
        }
      }
      
      // Ensure all fields are included
      const formatted = {
        _id: listing._id,
        farmerId: listing.farmerId?._id || listing.farmerId || listing.farmerUserId,
        farmerName: listing.farmerName || listing.farmer || (listing.farmerId?.name || 'Unknown Farmer'),
        location: listing.location || 'Not specified',
        wasteType: listing.wasteType || 'Unknown',
        quantity: listing.quantity || 'N/A',
        price: listing.price || 'N/A',
        carbonSaving: listing.carbonSaving || listing.co2Footprint || '0 kg CO₂',
        co2Footprint: listing.co2Footprint || listing.carbonSaving || '0 kg CO₂',
        image: imagePath || '🌾', // Will be replaced by frontend with default image if needed
        tags: listing.tags || [],
        inquiries: listing.inquiries || 0,
        status: listing.status || 'Active',
        description: listing.description || '',
        category: listing.category || '',
        expectedProcess: listing.expectedProcess || '',
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt
      };
      
      return formatted;
    });
    
    console.log(`✅ Returning ${formattedListings.length} active listings for marketplace`);
    res.json({ success: true, listings: formattedListings });
  } catch (err) {
    console.error('Error fetching marketplace listings:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get a specific listing
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await WasteListing.findById(req.params.id)
      .populate('farmerId', 'name email');
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({ success: true, listing });
  } catch (err) {
    console.error('Error fetching listing:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Increment inquiry count (when buyer views/interests in a listing)
router.post('/listings/:id/inquire', async (req, res) => {
  try {
    const listing = await WasteListing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    listing.inquiries = (listing.inquiries || 0) + 1;
    await listing.save();

    res.json({ success: true, listing });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create an inquiry for a listing
router.post('/inquiries', async (req, res) => {
  try {
    const buyerId = toObjectId(req.user);
    const { listingId, message } = req.body;

    if (!listingId || !message) {
      return res.status(400).json({ success: false, message: 'Listing ID and message are required' });
    }

    const listing = await WasteListing.findById(listingId).populate('farmerId', 'name');
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const buyer = await User.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer not found' });
    }

    const inquiry = new Inquiry({
      buyerId,
      farmerId: listing.farmerId._id || listing.farmerId,
      listingId: listing._id,
      buyerName: buyer.name,
      farmerName: listing.farmerName || listing.farmerId?.name || 'Unknown Farmer',
      message: message.trim(),
      status: 'Pending',
      replies: []
    });

    await inquiry.save();
    
    // Increment inquiry count on listing
    listing.inquiries = (listing.inquiries || 0) + 1;
    await listing.save();

    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    console.error('Error creating inquiry:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get buyer's inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const buyerId = toObjectId(req.user);
    const inquiries = await Inquiry.find({ buyerId })
      .populate('listingId', 'wasteType quantity price')
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, inquiries });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
