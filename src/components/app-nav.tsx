import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/logo";
import type { PublicUser } from "@/lib/types";
import { PLAN_LIMITS } from "@/lib/plans";

export function AppNav({ user }: { user: PublicUser }) {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/app" className="text-navy hover:text-clay">
            Library
          </Link>
          <Link href="/app/new" className="text-navy hover:text-clay">
            New pack
          </Link>
          <Link href="/app/billing" className="hidden text-navy hover:text-clay sm:block">
            {PLAN_LIMITS[user.plan].name}
          </Link>
          <form action={logout}>
            <button type="submit" className="text-muted hover:text-ink">
              Log out
            </button>
          </form>
          <Link
            href="/app/new"
            className="rounded-full bg-clay px-3.5 py-1.5 text-white"
          >
            Upload
          </Link>
        </nav>
      </div>
    </header>
  );
}
