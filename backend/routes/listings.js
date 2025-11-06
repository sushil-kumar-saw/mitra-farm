import express from 'express';
import WasteListing from '../models/WasteListing.js';

const router = express.Router();

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await WasteListing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new listing
router.post('/', async (req, res) => {
  try {
    const newListing = new WasteListing(req.body);
    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
