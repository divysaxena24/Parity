"use server";

import { sql, createId } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(planType) {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) return { error: "Not authenticated" };

  // Price IDs would normally come from environment variables
  const amount = planType === "YEARLY" ? 19999 : 2499; // in cents
  
  try {
    const email = user.emailAddresses[0]?.emailAddress || `${user.username}@parity.user`;
    const username = user.username || email;
    
    // Ensure user exists in our local Neon DB
    await sql`
      INSERT INTO users (id, email, username)
      VALUES (${userId}, ${email}, ${username})
      ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, email = EXCLUDED.email
    `;

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Parity ${planType} Membership`,
              description: "Golf performance tracking and charity impact rewards.",
            },
            unit_amount: amount,
            recurring: {
              interval: planType === "YEARLY" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      mode: "subscription",
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/pricing`,
      customer_email: email,
      metadata: {
        userId: userId,
        planType,
      },
    });

    return { url: checkoutSession.url };
  } catch (error) {
    console.error("Stripe error:", error);
    return { error: "Failed to initiate payment. Please try again." };
  }
}

/**
 * SIMPLIFIED SUCCESS HANDLER (for demo purposes)
 */
export async function handleSubscriptionSuccess(sessionId) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (checkoutSession.payment_status === 'paid') {
      const { planType } = checkoutSession.metadata;
      const subId = createId();
      const currentPeriodEnd = new Date(Date.now() + (planType === 'YEARLY' ? 365 : 30) * 24 * 60 * 60 * 1000);

      // 1. Create the subscription record
      await sql`
        INSERT INTO subscriptions (id, user_id, stripe_subscription_id, status, plan_type, current_period_end)
        VALUES (${subId}, ${userId}, ${checkoutSession.subscription}, 'ACTIVE', ${planType}, ${currentPeriodEnd})
      `;

      // 2. Update user status
      await sql`
        UPDATE users 
        SET subscription_status = 'ACTIVE' 
        WHERE id = ${userId}
      `;

      return { success: true };
    }
    return { error: "Payment not verified" };
  } catch (error) {
    console.error("Success handler error:", error);
    return { error: "Failed to verify subscription" };
  }
}

/**
 * Creates a Stripe portal session for managing subscriptions.
 * PRD Section 04: Billing portal access.
 */
export async function createPortalSession() {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    const [sub] = await sql`SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ${userId} AND status = 'ACTIVE' LIMIT 1`;
    
    if (!sub) return { error: "No active subscription found" };

    const subscription = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.customer,
      return_url: `${process.env.APP_URL || 'http://localhost:3000'}/dashboard/settings`,
    });

    return { url: portalSession.url };
  } catch (error) {
    console.error("Portal error:", error);
    return { error: "Failed to create portal session" };
  }
}
