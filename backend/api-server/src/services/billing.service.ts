import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Subscription, ISubscription } from '../models/Subscription.model';
import { Hospital } from '../models/Hospital.model';
import { whatsappService } from './whatsapp.service';

export class BillingService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!
    });
  }

  async createSubscription(hospitalId: string, plan: 'pro' | 'growth') {
    try {
      // Get hospital details
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        throw new Error('Hospital not found');
      }

      // Plan configurations
      const planConfig = {
        pro: {
          amount: 99900, // ₹999 in paise
          period: 'monthly',
          description: 'ClinicMind Pro Plan - Monthly'
        },
        growth: {
          amount: 299900, // ₹2999 in paise
          period: 'monthly',
          description: 'ClinicMind Growth Plan - Monthly'
        }
      };

      const config = planConfig[plan];

      // Create Razorpay subscription
      const razorpaySubscription = await this.razorpay.subscriptions.create({
        plan_id: await this.createPlan(plan, config.amount),
        total_count: 12, // 12 months
        customer_notify: 1,
        notes: {
          hospitalId,
          plan,
          hospitalName: hospital.name
        }
      });

      // Create or update subscription record
      const subscription = await Subscription.findOneAndUpdate(
        { hospitalId },
        {
          plan,
          razorpaySubscriptionId: razorpaySubscription.id,
          razorpayCustomerId: razorpaySubscription.customer_id,
          status: 'active',
          currentPeriodStart: new Date(razorpaySubscription.start_at * 1000),
          currentPeriodEnd: new Date(razorpaySubscription.end_at * 1000)
        },
        { upsert: true, new: true }
      );

      // Create payment link for first payment
      const paymentLink = await this.createPaymentLink(
        razorpaySubscription.id,
        config.amount,
        config.description
      );

      return {
        subscriptionId: subscription._id,
        razorpaySubscriptionId: razorpaySubscription.id,
        paymentLink: paymentLink.short_url
      };
    } catch (error: any) {
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  private async createPlan(plan: string, amount: number): Promise<string> {
    try {
      const razorpayPlan = await this.razorpay.plans.create({
        period: 'monthly',
        interval: 1,
        item: {
          name: `ClinicMind ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
          amount,
          currency: 'INR',
          description: `Monthly subscription for ClinicMind ${plan} plan`
        },
        notes: {
          plan
        }
      });
      return razorpayPlan.id;
    } catch (error: any) {
      throw new Error(`Plan creation failed: ${error.message}`);
    }
  }

  private async createPaymentLink(subscriptionId: string, amount: number, description: string) {
    try {
      const paymentLink = await this.razorpay.paymentLink.create({
        amount,
        currency: 'INR',
        accept_partial: false,
        description,
        reference_id: subscriptionId,
        customer: {
          name: 'ClinicMind Customer',
          email: 'billing@clinicmind.in'
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        callback_url: `${process.env.FRONTEND_URL}/billing/success`,
        callback_method: 'get'
      });
      return paymentLink;
    } catch (error: any) {
      throw new Error(`Payment link creation failed: ${error.message}`);
    }
  }

  async handleWebhook(payload: any, signature: string) {
    try {
      // Verify webhook signature
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new Error('Invalid webhook signature');
      }

      const event = payload.event;
      const data = payload.payload.payment_link.entity;

      switch (event) {
        case 'payment_link.paid':
          await this.handlePaymentSuccess(data);
          break;
        case 'subscription.activated':
          await this.handleSubscriptionActivated(data);
          break;
        case 'subscription.cancelled':
          await this.handleSubscriptionCancelled(data);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(data);
          break;
        default:
          console.log(`Unhandled webhook event: ${event}`);
      }
    } catch (error: any) {
      throw new Error(`Webhook handling failed: ${error.message}`);
    }
  }

  private async handlePaymentSuccess(data: any) {
    const subscriptionId = data.reference_id;
    await Subscription.updateOne(
      { razorpaySubscriptionId: subscriptionId },
      { status: 'active' }
    );
  }

  private async handleSubscriptionActivated(data: any) {
    const subscriptionId = data.id;
    const hospitalId = data.notes?.hospitalId;
    const plan = data.notes?.plan;

    // Update subscription status
    await Subscription.updateOne(
      { razorpaySubscriptionId: subscriptionId },
      {
        status: 'active',
        currentPeriodStart: new Date(data.start_at * 1000),
        currentPeriodEnd: new Date(data.end_at * 1000)
      }
    );

    // Update hospital plan
    if (hospitalId && plan) {
      await Hospital.findByIdAndUpdate(hospitalId, { plan });
    }
  }

  private async handleSubscriptionCancelled(data: any) {
    const subscriptionId = data.id;
    const hospitalId = data.notes?.hospitalId;

    // Update subscription status
    await Subscription.updateOne(
      { razorpaySubscriptionId: subscriptionId },
      { status: 'cancelled' }
    );

    // Revert hospital to free plan
    if (hospitalId) {
      await Hospital.findByIdAndUpdate(hospitalId, { plan: 'free' });
    }
  }

  private async handlePaymentFailed(data: any) {
    const subscriptionId = data.reference_id;
    
    // Get subscription details
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionId });
    if (subscription) {
      const hospital = await Hospital.findById(subscription.hospitalId);
      if (hospital && hospital.phone) {
        // Send WhatsApp notification
        await whatsappService.sendTextMessage(
          hospital.phone,
          'Payment failed for your ClinicMind subscription. Please update your payment method to continue using our services.'
        );
      }
    }
  }

  async getSubscription(hospitalId: string) {
    try {
      const subscription = await Subscription.findOne({ hospitalId })
        .populate('hospitalId', 'name email phone')
        .lean();

      if (!subscription) {
        // Return default free plan info
        return {
          plan: 'free',
          status: 'trial',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
          features: this.getPlanFeatures('free')
        };
      }

      return {
        ...subscription,
        features: this.getPlanFeatures(subscription.plan)
      };
    } catch (error: any) {
      throw new Error(`Get subscription failed: ${error.message}`);
    }
  }

  private getPlanFeatures(plan: string) {
    const features = {
      free: {
        maxDoctors: 5,
        maxPatients: 100,
        maxAppointmentsPerDay: 50,
        aiFeatures: false,
        whatsappIntegration: false,
        analytics: false
      },
      pro: {
        maxDoctors: 20,
        maxPatients: 1000,
        maxAppointmentsPerDay: 200,
        aiFeatures: true,
        whatsappIntegration: true,
        analytics: true
      },
      growth: {
        maxDoctors: -1, // Unlimited
        maxPatients: -1, // Unlimited
        maxAppointmentsPerDay: -1, // Unlimited
        aiFeatures: true,
        whatsappIntegration: true,
        analytics: true,
        prioritySupport: true
      }
    };

    return features[plan as keyof typeof features] || features.free;
  }

  async cancelSubscription(hospitalId: string) {
    try {
      const subscription = await Subscription.findOne({ hospitalId });
      
      if (!subscription || !subscription.razorpaySubscriptionId) {
        throw new Error('No active subscription found');
      }

      // Cancel with Razorpay
      await this.razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId);

      // Update local record
      await Subscription.updateOne(
        { hospitalId },
        { status: 'cancelled' }
      );

      // Revert hospital to free plan
      await Hospital.findByIdAndUpdate(hospitalId, { plan: 'free' });

      return { message: 'Subscription cancelled successfully' };
    } catch (error: any) {
      throw new Error(`Subscription cancellation failed: ${error.message}`);
    }
  }
}

export const billingService = new BillingService();
