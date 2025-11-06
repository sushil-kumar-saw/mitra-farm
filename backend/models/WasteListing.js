// models/WasteListing.js
import mongoose from 'mongoose';

const WasteListingSchema = new mongoose.Schema({
  farmer: String,
  location: String,
  wasteType: String,
  quantity: String,
  price: String,
  carbonSaving: String,
  image: String,
  rating: Number,
  distance: String,
  freshness: String,
  tags: [String]
}, { timestamps: true });

export default mongoose.models.WasteListing || mongoose.model('WasteListing', WasteListingSchema);
