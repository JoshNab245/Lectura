import type { ReactNode } from "react";
import { AppNav } from "@/components/app-nav";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  return (
    <div className="flex min-h-full flex-col">
      <AppNav user={user} />
      <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</div>
    </div>
  );
}
