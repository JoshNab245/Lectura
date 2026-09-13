import Stripe from "stripe";

export function hasStripe() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export function stripePriceId(plan: "student" | "pro") {
  return plan === "student"
    ? process.env.STRIPE_PRICE_STUDENT
    : process.env.STRIPE_PRICE_PRO;
}

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
