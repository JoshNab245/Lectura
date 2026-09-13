import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-ink">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-[13px] font-semibold tracking-tight text-card">
        L
      </span>
      {!compact ? <span className="serif text-xl tracking-tight">Lectura</span> : null}
    </Link>
  );
}
