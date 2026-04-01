import { sql } from '@/lib/db';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe Webhook Error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle PRD Section 04 lifecycles
  const session = event.data.object;

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(session);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDelete(session);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.error('Database Sync Error:', err);
    return new Response('Sync Error', { status: 500 });
  }

  return new Response('', { status: 200 });
}

async function handleSubscriptionChange(subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  const status = subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE';
  
  await sql`
    UPDATE users 
    SET subscription_status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;

  // Also sync to the subscriptions table for detailed tracking
  const id = subscription.id;
  await sql`
    INSERT INTO subscriptions (id, user_id, stripe_subscription_id, status, current_period_end)
    VALUES (${id}, ${userId}, ${subscription.id}, ${status}, ${new Date(subscription.current_period_end * 1000)})
    ON CONFLICT (stripe_subscription_id) DO UPDATE SET 
      status = EXCLUDED.status,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = CURRENT_TIMESTAMP
  `;
}

async function handleSubscriptionDelete(subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await sql`
    UPDATE users 
    SET subscription_status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;

  await sql`
    UPDATE subscriptions 
    SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ${subscription.id}
  `;
}
