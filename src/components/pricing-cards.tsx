"use client";

import { useState, useTransition } from "react";
import { demoUpgrade, startCheckout } from "@/app/actions/billing";
import { PLAN_LIMITS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/types";

export function PricingCards({
  current,
  stripeReady,
  highlight,
}: {
  current?: Plan;
  stripeReady: boolean;
  highlight?: boolean;
}) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function choose(plan: "student" | "pro") {
    setError(undefined);
    startTransition(async () => {
      const result = stripeReady ? await startCheckout(plan) : await demoUpgrade(plan);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {(Object.keys(PLAN_LIMITS) as Plan[]).map((key) => {
          const plan = PLAN_LIMITS[key];
          const featured = key === "student";
          return (
            <article
              key={key}
              className={cn(
                "flex flex-col rounded-3xl border bg-card p-6",
                featured && highlight ? "border-clay shadow-[0_20px_50px_-28px_rgba(196,92,44,0.7)]" : "border-line",
              )}
            >
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{plan.name}</p>
              <p className="serif mt-3 text-4xl">
                {plan.price === 0 ? "£0" : `£${plan.price}`}
                <span className="ml-1 text-lg text-muted">/{plan.period}</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">{plan.blurb}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-clay" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {key === "free" ? (
                  <p className="text-sm text-muted">
                    {current === "free" ? "Your current plan." : "Included when you create an account."}
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={pending || current === key}
                    onClick={() => choose(key)}
                    className={cn(
                      "w-full rounded-full py-3 text-sm font-medium disabled:opacity-50",
                      featured ? "bg-clay text-white" : "bg-navy text-card",
                    )}
                  >
                    {current === key ? "Current plan" : stripeReady ? `Subscribe to ${plan.name}` : `Unlock ${plan.name} (demo)`}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {error ? <p className="mt-4 text-center text-sm text-clay">{error}</p> : null}
      {!stripeReady ? (
        <p className="mt-4 text-center text-sm text-muted">
          Stripe keys are optional in development. Demo upgrade changes the plan locally.
        </p>
      ) : null}
    </div>
  );
}
