import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import WasteListing from '../models/WasteListing.js';
import Buyer from '../models/Buyer.js';
import Purchase from '../models/Purchase.js';

const router = express.Router();

// All buyer routes require authentication
router.use(verifyToken);

// Get buyer dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const userId = req.user;
    
    // Get buyer profile
    const buyer = await Buyer.findOne({ userId });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found' });
    }

    // Get purchase statistics
    const purchases = await Purchase.find({ buyerId: userId });
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
    const userId = req.user;
    const purchases = await Purchase.find({ buyerId: userId })
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
    const userId = req.user;
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
    const existingPurchase = await Purchase.findOne({ buyerId: userId, listingId });
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
      buyerId: userId,
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
    
    res.json({ success: true, listings });
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

export default router;
