import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import WasteListing from '../models/WasteListing.js';
import Buyer from '../models/Buyer.js';

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

    // Get all active listings (marketplace)
    const allListings = await WasteListing.find({ status: 'Active' });
    
    // Calculate buyer-specific stats (can be extended with purchase history)
    const totalPurchases = 0; // Placeholder - can be calculated from purchase history
    const carbonSaved = 2845; // Placeholder - can be calculated from purchases
    const activeTransactions = 0; // Placeholder

    res.json({
      success: true,
      stats: {
        totalPurchases,
        carbonSaved,
        activeTransactions,
        availableListings: allListings.length
      }
    });
  } catch (err) {
    console.error('Error fetching buyer stats:', err);
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

