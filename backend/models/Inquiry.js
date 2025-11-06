import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'WasteListing', required: true },
  buyerName: { type: String, required: true },
  farmerName: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Replied', 'Resolved'], default: 'Pending' },
  replies: [{
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

