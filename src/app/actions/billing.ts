"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { updateDb } from "@/lib/db";
import { appUrl, getStripe, hasStripe, stripePriceId } from "@/lib/stripe";
import type { Plan } from "@/lib/types";

export type BillingState = { error?: string } | undefined;

export async function startCheckout(plan: "student" | "pro"): Promise<BillingState> {
  const user = await requireUser();
  if (!hasStripe()) {
    return { error: "Stripe is not configured. Use demo upgrade on the billing page." };
  }
  const price = stripePriceId(plan);
  if (!price) return { error: `Missing STRIPE_PRICE_${plan.toUpperCase()} in the environment.` };

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.stripeCustomerId ? undefined : user.email,
    customer: user.stripeCustomerId || undefined,
    client_reference_id: user.id,
    line_items: [{ price, quantity: 1 }],
    success_url: `${appUrl()}/app/billing?status=success`,
    cancel_url: `${appUrl()}/pricing?status=cancelled`,
    metadata: { userId: user.id, plan },
  });

  if (!session.url) return { error: "Stripe did not return a checkout URL." };
  redirect(session.url);
}

export async function openPortal(): Promise<BillingState> {
  const user = await requireUser();
  if (!hasStripe() || !user.stripeCustomerId) {
    return { error: "No Stripe customer is on file yet." };
  }
  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl()}/app/billing`,
  });
  redirect(portal.url);
}

export async function demoUpgrade(plan: Plan): Promise<BillingState> {
  const user = await requireUser();
  if (hasStripe()) {
    return { error: "Stripe is configured — use checkout instead of the demo upgrade." };
  }
  if (plan === "free") return { error: "Pick Student or Pro." };
  await updateDb((db) => {
    const record = db.users.find((item) => item.id === user.id);
    if (record) {
      record.plan = plan;
      record.subscriptionStatus = "demo";
    }
  });
  redirect("/app/billing?status=demo");
}
