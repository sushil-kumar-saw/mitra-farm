import express from 'express';
import mongoose from 'mongoose';
import { verifyToken } from '../middleware/authMiddleware.js';
import WasteListing from '../models/WasteListing.js';
import User from '../models/user.js';
import Farmer from '../models/Farmer.js';
import Purchase from '../models/Purchase.js';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

// Helper function to convert string to ObjectId
const toObjectId = (id) => {
  if (!id) return id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return id;
};

// All farmer routes require authentication
router.use(verifyToken);

// Get farmer dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const farmerId = toObjectId(req.user);
    
    // Get farmer profile
    const farmer = await Farmer.findOne({ userId: farmerId });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found' });
    }

    // Get all listings for this farmer
    const listings = await WasteListing.find({ farmerId });
    
    // Calculate stats
    const activeListings = listings.filter(l => l.status === 'Active').length;
    const totalEarnings = listings
      .filter(l => l.status === 'Sold')
      .reduce((sum, listing) => {
        const priceMatch = listing.price.match(/₹([\d,]+)/);
        const quantityMatch = listing.quantity.match(/([\d.]+)/);
        if (priceMatch && quantityMatch) {
          const price = parseFloat(priceMatch[1].replace(/,/g, ''));
          const quantity = parseFloat(quantityMatch[1]);
          return sum + (price * quantity);
        }
        return sum;
      }, 0);

    // Calculate total CO2 saved
    const totalCo2Saved = listings.reduce((sum, listing) => {
      const co2Match = listing.carbonSaving?.match(/([\d.]+)/);
      if (co2Match) {
        return sum + parseFloat(co2Match[1]);
      }
      return sum;
    }, 0);

    // Calculate total waste recycled (in tons)
    const totalWasteRecycled = listings.reduce((sum, listing) => {
      const quantityMatch = listing.quantity.match(/([\d.]+)/);
      if (quantityMatch) {
        const quantity = parseFloat(quantityMatch[1]);
        // Convert to tons if in kg
        if (listing.quantity.toLowerCase().includes('kg')) {
          return sum + (quantity / 1000);
        }
        return sum + quantity;
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      stats: {
        totalEarnings: Math.round(totalEarnings),
        carbonSaved: Math.round(totalCo2Saved),
        wasteRecycled: Math.round(totalWasteRecycled),
        activeListings
      }
    });
  } catch (err) {
    console.error('Error fetching farmer stats:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get farmer's listings
router.get('/listings', async (req, res) => {
  try {
    const farmerId = toObjectId(req.user);
    const listings = await WasteListing.find({ farmerId })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, listings });
  } catch (err) {
    console.error('Error fetching farmer listings:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create a new listing
router.post('/listings', async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const listingData = {
      ...req.body,
      farmerId: userId,
      farmerName: user.name
    };

    const newListing = new WasteListing(listingData);
    await newListing.save();

    res.status(201).json({ success: true, listing: newListing });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update a listing
router.put('/listings/:id', async (req, res) => {
  try {
    const userId = req.user;
    const listing = await WasteListing.findOne({ _id: req.params.id, farmerId: userId });
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json({ success: true, listing });
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete a listing
router.delete('/listings/:id', async (req, res) => {
  try {
    const userId = req.user;
    const listing = await WasteListing.findOneAndDelete({ _id: req.params.id, farmerId: userId });
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({ success: true, message: 'Listing deleted' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get inquiries for farmer's listings (includes both purchases and inquiries)
router.get('/inquiries', async (req, res) => {
  try {
    const farmerId = toObjectId(req.user);
    
    // Get all listings for this farmer
    const listings = await WasteListing.find({ farmerId });
    const listingIds = listings.map(l => l._id);
    
    // Get purchases for these listings (purchase inquiries)
    const purchases = await Purchase.find({ listingId: { $in: listingIds } })
      .populate('buyerId', 'name email')
      .populate('listingId', 'wasteType quantity')
      .sort({ createdAt: -1 });
    
    // Get inquiries (message inquiries)
    const inquiries = await Inquiry.find({ farmerId })
      .populate('buyerId', 'name email')
      .populate('listingId', 'wasteType quantity price')
      .sort({ createdAt: -1 });
    
    // Transform purchases into inquiry format
    const purchaseInquiries = purchases.map(purchase => ({
      id: purchase._id,
      type: 'purchase',
      buyerId: purchase.buyerId._id,
      buyerName: purchase.buyerId?.name || 'Unknown Buyer',
      buyerEmail: purchase.buyerId?.email || '',
      listingId: purchase.listingId._id,
      product: `${purchase.wasteType} - ${purchase.quantity}`,
      message: `Interested in purchasing ${purchase.quantity} of ${purchase.wasteType}`,
      status: purchase.status === 'Pending' ? 'new' : purchase.status === 'Confirmed' ? 'confirmed' : 'completed',
      purchaseStatus: purchase.status,
      createdAt: purchase.createdAt,
      totalAmount: purchase.totalAmount
    }));
    
    // Transform inquiries
    const messageInquiries = inquiries.map(inquiry => ({
      id: inquiry._id,
      type: 'inquiry',
      buyerId: inquiry.buyerId._id,
      buyerName: inquiry.buyerName,
      buyerEmail: inquiry.buyerId?.email || '',
      listingId: inquiry.listingId._id,
      product: `${inquiry.listingId?.wasteType || 'Unknown'} - ${inquiry.listingId?.quantity || 'N/A'}`,
      message: inquiry.message,
      status: inquiry.status === 'Pending' ? 'new' : inquiry.status === 'Replied' ? 'replied' : 'resolved',
      replies: inquiry.replies || [],
      createdAt: inquiry.createdAt
    }));
    
    // Combine and sort by date
    const allInquiries = [...purchaseInquiries, ...messageInquiries].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json({ success: true, inquiries: allInquiries });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reply to an inquiry
router.post('/inquiries/:id/reply', async (req, res) => {
  try {
    const farmerId = toObjectId(req.user);
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (inquiry.farmerId.toString() !== farmerId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to reply to this inquiry' });
    }

    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    inquiry.replies.push({
      authorId: farmerId,
      authorName: farmer.name,
      message: message.trim()
    });

    inquiry.status = 'Replied';
    await inquiry.save();

    res.json({ success: true, inquiry });
  } catch (err) {
    console.error('Error replying to inquiry:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

