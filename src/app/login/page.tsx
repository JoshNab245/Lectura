import Link from "next/link";
import { DemoButton, LoginForm } from "@/components/auth-forms";
import { Logo } from "@/components/logo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-5 py-16">
      <Logo />
      <h1 className="serif mt-10 text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Demo account: demo@lectura.app / lectura123</p>
      <div className="mt-8 rounded-3xl border border-line bg-card p-6">
        <LoginForm next={next || "/app"} />
        <div className="mt-4 border-t border-line pt-4">
          <DemoButton />
        </div>
      </div>
      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="text-navy underline-offset-4 hover:underline">
          Create a free account
        </Link>
      </p>
    </main>
  );
}
