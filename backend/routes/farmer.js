import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import WasteListing from '../models/WasteListing.js';
import User from '../models/user.js';
import Farmer from '../models/Farmer.js';

const router = express.Router();

// All farmer routes require authentication
router.use(verifyToken);

// Get farmer dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const userId = req.user;
    
    // Get farmer profile
    const farmer = await Farmer.findOne({ userId });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found' });
    }

    // Get all listings for this farmer
    const listings = await WasteListing.find({ farmerId: userId });
    
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
    const userId = req.user;
    const listings = await WasteListing.find({ farmerId: userId })
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

// Get inquiries for farmer's listings
router.get('/inquiries', async (req, res) => {
  try {
    const userId = req.user;
    // For now, return empty array - can be extended when inquiry system is implemented
    res.json({ success: true, inquiries: [] });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

