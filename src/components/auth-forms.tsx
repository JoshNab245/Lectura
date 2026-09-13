"use client";

import { useActionState } from "react";
import { login, loginDemo, signup, type AuthState } from "@/app/actions/auth";

export function LoginForm({ next = "/app" }: { next?: string }) {
  const [state, action, pending] = useActionState(login, undefined as AuthState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Password" name="password" type="password" autoComplete="current-password" />
      {state?.error ? <p className="text-sm text-clay">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-navy py-3 text-sm font-medium text-card disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined as AuthState);

  return (
    <form action={action} className="space-y-4">
      <Field label="Name" name="name" autoComplete="name" />
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Password" name="password" type="password" autoComplete="new-password" />
      {state?.error ? <p className="text-sm text-clay">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-clay py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create free account"}
      </button>
    </form>
  );
}

export function DemoButton() {
  return (
    <form action={loginDemo}>
      <button type="submit" className="w-full text-sm font-medium text-navy underline-offset-4 hover:underline">
        Open the demo library
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-ink outline-none ring-clay/30 focus:ring-2"
      />
    </label>
  );
}
