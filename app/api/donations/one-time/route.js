import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, charityId, charityName } = await req.json();

    if (!amount || !charityId) {
      return NextResponse.json({ error: "Missing donation details" }, { status: 400 });
    }

    // Create a Stripe Checkout Session for a ONE-TIME payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Independent Donation: ${charityName}`,
              description: `One-time contribution to ${charityName} via Parity.`,
            },
            unit_amount: amount * 100, // Cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/dashboard?donation_success=true`,
      cancel_url: `${process.env.APP_URL}/charities`,
      metadata: {
        userId,
        charityId,
        donationType: "ONE_TIME",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Donation Error:", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
