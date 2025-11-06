import express from 'express';
import Farmer from '../models/Farmer.js';
import WasteListing from '../models/WasteListing.js';

const router = express.Router();

// Platform stats for homepage widgets
router.get('/platform', async (req, res) => {
  try {
    const [activeFarmers, listingsCount] = await Promise.all([
      Farmer.countDocuments({}),
      WasteListing.countDocuments({}),
    ]);

    // Derive simple metrics; adjust as your data model evolves
    const co2Saved = listingsCount * 5; // placeholder: 5 tons per listing
    const revenueMillions = Math.max(0, Math.round(listingsCount * 0.01));

    res.json({
      activeFarmers,
      co2Saved,
      revenueMillions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


