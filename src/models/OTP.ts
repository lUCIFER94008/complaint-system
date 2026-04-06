import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const OTPSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expiresAt: Date,
  },
  { timestamps: true }
);

// ⏳ Auto delete expired OTP
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTP ||
  mongoose.model<IOTP>("OTP", OTPSchema);
