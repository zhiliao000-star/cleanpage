import { NextResponse } from "next/server";

import { createCleanPageEntry } from "@/lib/clean";

function asPrismaCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = (error as { code?: string }).code;
    if (typeof code === "string") return code;
  }
  return null;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { url?: string };
  const sourceUrl = String(body.url || "").trim();

  try {
    const entry = await createCleanPageEntry(sourceUrl);
    return NextResponse.json({ ok: true, publicId: entry.publicId });
  } catch (error) {
    const code = asPrismaCode(error);

    if (code === "P2021") {
      return NextResponse.json(
        { error: "TABLE_NOT_FOUND", message: "Please run prisma db push" },
        { status: 500 },
      );
    }

    if (code === "P1001") {
      return NextResponse.json({ error: "CONNECTION_FAILED", port: "6543" }, { status: 500 });
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "UNKNOWN_ERROR", message }, { status: 500 });
  }
}
