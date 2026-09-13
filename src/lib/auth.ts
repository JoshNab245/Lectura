import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserById } from "@/lib/db";
import { sessionCookie, type SessionPayload, verifySession } from "@/lib/session";
import { toPublicUser } from "@/lib/utils";
import type { PublicUser } from "@/lib/types";

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(sessionCookie.name)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await findUserById(session.sub);
  if (!user) return null;
  return toPublicUser(user);
}

export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
