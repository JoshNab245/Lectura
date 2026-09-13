import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { findPack } from "@/lib/db";
import { canExportAnki } from "@/lib/plans";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (!canExportAnki(user.plan)) {
    return NextResponse.json(
      { error: "Anki export is included on Pro." },
      { status: 403 },
    );
  }
  const { id } = await params;
  const pack = await findPack(user.id, id);
  if (!pack) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rows = [
    "front,back",
    ...pack.flashcards.map((card) => {
      const esc = (value: string) => `"${value.replaceAll('"', '""')}"`;
      return `${esc(card.front)},${esc(card.back)}`;
    }),
  ].join("\n");

  return new NextResponse(rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${pack.title.replace(/[^\w]+/g, "-")}-anki.csv"`,
    },
  });
}
