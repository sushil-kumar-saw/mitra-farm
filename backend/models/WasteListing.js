// models/WasteListing.js
import mongoose from 'mongoose';

const WasteListingSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String, required: true },
  location: { type: String, required: true },
  wasteType: { type: String, required: true },
  quantity: { type: String, required: true }, // e.g., "50 tons", "500 kg"
  price: { type: String, required: true }, // e.g., "₹8,500/ton"
  carbonSaving: { type: String }, // e.g., "145 kg CO₂"
  image: { type: String, default: '🌾' },
  rating: { type: Number, default: 0 },
  distance: { type: String },
  freshness: { type: String },
  tags: [{ type: String }],
  status: { type: String, enum: ['Active', 'Sold', 'Inactive'], default: 'Active' },
  inquiries: { type: Number, default: 0 },
  description: { type: String },
  category: { type: String },
  expectedProcess: { type: String },
  co2Footprint: { type: String }
}, { timestamps: true });

export default mongoose.models.WasteListing || mongoose.model('WasteListing', WasteListingSchema);
