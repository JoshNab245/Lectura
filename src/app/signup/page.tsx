import Link from "next/link";
import { DemoButton, SignupForm } from "@/components/auth-forms";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-5 py-16">
      <Logo />
      <h1 className="serif mt-10 text-4xl">Start this term organised</h1>
      <p className="mt-2 text-sm text-muted">Three study packs a month on the free plan. No card.</p>
      <div className="mt-8 rounded-3xl border border-line bg-card p-6">
        <SignupForm />
        <div className="mt-4 border-t border-line pt-4">
          <DemoButton />
        </div>
      </div>
      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-navy underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
