import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String },
  companyType: { type: String }, // e.g., "Retailer", "Wholesaler"
  location: { type: String },
  contactNumber: { type: String },
}, { timestamps: true });

export default mongoose.model('Buyer', buyerSchema);
