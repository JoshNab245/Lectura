import { PricingCards } from "@/components/pricing-cards";
import { requireUser } from "@/lib/auth";
import { PLAN_LIMITS } from "@/lib/plans";
import { hasStripe } from "@/lib/stripe";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { status } = await searchParams;

  return (
    <main>
      <h1 className="serif text-4xl">Plan & billing</h1>
      <p className="mt-2 text-muted">
        You are on {PLAN_LIMITS[user.plan].name}
        {user.subscriptionStatus ? ` (${user.subscriptionStatus})` : ""}.
      </p>
      {status === "success" ? (
        <p className="mt-4 rounded-2xl bg-sage/15 px-4 py-3 text-sm text-sage">Subscription updated.</p>
      ) : null}
      {status === "demo" ? (
        <p className="mt-4 rounded-2xl bg-sage/15 px-4 py-3 text-sm text-sage">
          Demo upgrade applied on this machine.
        </p>
      ) : null}
      <div className="mt-10">
        <PricingCards current={user.plan} stripeReady={hasStripe()} highlight />
      </div>
    </main>
  );
}
