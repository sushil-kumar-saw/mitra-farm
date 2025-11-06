import express from 'express';
import WasteListing from '../models/WasteListing.js';

const router = express.Router();

// Get all listings (public endpoint)
router.get('/', async (req, res) => {
  try {
    const listings = await WasteListing.find({ status: 'Active' })
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get a specific listing (public endpoint)
router.get('/:id', async (req, res) => {
  try {
    const listing = await WasteListing.findById(req.params.id)
      .populate('farmerId', 'name email');
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
