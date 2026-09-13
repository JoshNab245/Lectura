import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { countPacksThisMonth, packsForUser } from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/plans";
import { formatDate } from "@/lib/utils";

export default async function LibraryPage() {
  const user = await requireUser();
  const packs = await packsForUser(user.id);
  const used = await countPacksThisMonth(user.id);
  const limit = PLAN_LIMITS[user.plan].packsPerMonth;
  const remaining = Number.isFinite(limit) ? Math.max(limit - used, 0) : "Unlimited";

  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Hello, {user.name.split(" ")[0]}</p>
          <h1 className="serif mt-1 text-4xl">Library</h1>
        </div>
        <Link href="/app/new" className="rounded-full bg-clay px-4 py-2 text-sm font-medium text-white">
          New study pack
        </Link>
      </div>
      <p className="mt-3 text-sm text-muted">
        {PLAN_LIMITS[user.plan].name} plan · {remaining}
        {typeof remaining === "number" ? " packs left this month" : " packs"}
      </p>

      {packs.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line bg-card p-10 text-center">
          <p className="serif text-2xl">Nothing here yet</p>
          <p className="mt-2 text-sm text-muted">Upload this week’s slides or a lecture recording.</p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {packs.map((pack) => (
            <li key={pack.id}>
              <Link
                href={`/app/packs/${pack.id}`}
                className="block rounded-3xl border border-line bg-card p-6 hover:border-navy/40"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-clay">{pack.sourceType}</p>
                <h2 className="serif mt-2 text-2xl">{pack.title}</h2>
                <p className="mt-2 text-sm text-muted">{pack.course || "No module tag"}</p>
                <p className="mt-4 text-sm text-muted">
                  {pack.flashcards.length} cards · {pack.quiz.length} quiz · {formatDate(pack.createdAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
