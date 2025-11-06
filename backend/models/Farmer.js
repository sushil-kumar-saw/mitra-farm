import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  landSize: { type: String, required: false }, // e.g., "5 acres"
  cropTypes: [{ type: String }], // e.g., ["wheat", "rice"]
  location: { type: String }, // optional: village, city, etc.
  contactNumber: { type: String },
}, { timestamps: true });

export default mongoose.model('Farmer', farmerSchema);
