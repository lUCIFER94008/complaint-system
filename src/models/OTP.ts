import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const OTPSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,
});

// auto delete after expiry
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP: Model<IOTP> = 
  mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);
