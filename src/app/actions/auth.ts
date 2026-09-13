"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByEmail, saveUser } from "@/lib/db";
import { sessionCookie, signSession } from "@/lib/session";
import { newId, nowIso } from "@/lib/utils";
import type { User } from "@/lib/types";

export type AuthState = { error?: string } | undefined;

async function setSessionCookie(user: User) {
  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
  const store = await cookies();
  store.set(sessionCookie.name, token, sessionCookie.options);
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (name.length < 2) return { error: "Tell us your name." };
  if (!email.includes("@")) return { error: "Use a valid university or personal email." };
  if (password.length < 8) return { error: "Password needs at least 8 characters." };

  const existing = await findUserByEmail(email);
  if (existing) return { error: "That email already has an account. Log in instead." };

  const user: User = {
    id: newId(),
    email,
    name,
    passwordHash: await bcrypt.hash(password, 10),
    plan: "free",
    createdAt: nowIso(),
  };
  await saveUser(user);
  await setSessionCookie(user);
  redirect("/app");
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/app") || "/app";

  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Email or password does not match." };
  }
  await setSessionCookie(user);
  redirect(next.startsWith("/") ? next : "/app");
}

export async function loginDemo() {
  let user = await findUserByEmail("demo@lectura.app");
  if (!user) {
    user = {
      id: newId(),
      email: "demo@lectura.app",
      name: "Maya Chen",
      passwordHash: await bcrypt.hash("lectura123", 10),
      plan: "student",
      createdAt: nowIso(),
    };
    await saveUser(user);
  }
  await setSessionCookie(user);
  redirect("/app");
}

export async function logout() {
  const store = await cookies();
  store.delete(sessionCookie.name);
  redirect("/");
}
