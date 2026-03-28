import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  hospitalId: mongoose.Types.ObjectId;
  plan: 'free' | 'pro' | 'growth';
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  hospitalId: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'growth'],
    required: true,
    default: 'free'
  },
  razorpaySubscriptionId: {
    type: String,
    sparse: true
  },
  razorpayCustomerId: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'trial'],
    required: true,
    default: 'trial'
  },
  currentPeriodStart: {
    type: Date,
    required: true
  },
  currentPeriodEnd: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
SubscriptionSchema.index({ hospitalId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ plan: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
