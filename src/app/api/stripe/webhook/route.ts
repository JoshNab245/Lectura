import { NextRequest, NextResponse } from "next/server";
import { updateDb } from "@/lib/db";
import { getStripe, hasStripe } from "@/lib/stripe";
import type { Plan } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!hasStripe()) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 501 });
  }

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId ?? session.client_reference_id;
    const plan = (session.metadata?.plan ?? "student") as Plan;
    if (userId) {
      await updateDb((db) => {
        const user = db.users.find((item) => item.id === userId);
        if (!user) return;
        user.plan = plan === "pro" ? "pro" : "student";
        user.stripeCustomerId = String(session.customer ?? user.stripeCustomerId ?? "");
        user.stripeSubscriptionId = String(session.subscription ?? "");
        user.subscriptionStatus = "active";
      });
    }
  }

  return NextResponse.json({ received: true });
}
