import { notFound } from "next/navigation";
import { PackWorkspace } from "@/components/pack-workspace";
import { requireUser } from "@/lib/auth";
import { findPack } from "@/lib/db";
import { visibleFlashcards } from "@/lib/plans";
import { formatDate } from "@/lib/utils";

export default async function PackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const pack = await findPack(user.id, id);
  if (!pack) notFound();
  const cards = visibleFlashcards(pack, user.plan);

  return (
    <main>
      <p className="text-sm text-muted">
        {pack.course ?? "Study pack"} · {formatDate(pack.createdAt)}
        {pack.usedAi ? " · AI rewritten" : " · extracted from source"}
      </p>
      <h1 className="serif mt-2 text-4xl leading-tight">{pack.title}</h1>
      <div className="mt-8">
        <PackWorkspace pack={pack} plan={user.plan} cards={cards} />
      </div>
    </main>
  );
}
