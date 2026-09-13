import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/logo";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-navy sm:flex">
          <Link href="/#how" className="hover:text-clay">
            How it works
          </Link>
          <Link href="/pricing" className="hover:text-clay">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/app"
              className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-card hover:bg-ink"
            >
              Library
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-navy sm:block">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-clay px-4 py-2 text-sm font-medium text-white hover:bg-[#a94b24]"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Lectura · built for reading week, not for busywork.</p>
        <p>PowerPoint, lecture audio, and video in. Study packs out.</p>
      </div>
    </footer>
  );
}
