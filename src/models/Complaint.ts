import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComplaint extends Document {
  title?: string;
  description?: string;
  name?: string;
  email?: string;
  message?: string;
  status: 'pending' | 'inprogress' | 'resolved';
  phone?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const ComplaintSchema: Schema = new Schema({
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  name: { type: String, trim: true },
  email: { type: String, trim: true },
  message: { type: String, trim: true },
  phone: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'inprogress', 'resolved'], default: 'pending' },
}, { timestamps: true });

export const Complaint: Model<IComplaint> = mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
