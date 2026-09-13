import { PricingCards } from "@/components/pricing-cards";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/auth";
import { hasStripe } from "@/lib/stripe";

export default async function PricingPage() {
  const user = await getCurrentUser();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-clay">Pricing</p>
        <h1 className="serif mt-3 max-w-2xl text-5xl leading-tight">Student-priced, exam-shaped.</h1>
        <p className="mt-4 max-w-xl text-muted">
          Free is enough to try Lectura on a few lectures. Student is the plan most people stay on
          through term.
        </p>
        <div className="mt-12">
          <PricingCards current={user?.plan} stripeReady={hasStripe()} highlight />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
