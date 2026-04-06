import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { 
      type: Date, 
      required: true, 
      index: { expires: 0 } // TTL index: delete when current time > expiresAt
    },
  },
  { timestamps: true }
);

export const OTP: Model<IOTP> = 
  mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);
