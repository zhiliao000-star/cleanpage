import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
}

async function runMigration() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CleanPageEntry" (
      "id" SERIAL PRIMARY KEY,
      "publicId" TEXT NOT NULL,
      "sourceUrl" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "markdown" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "CleanPageEntry_publicId_key"
    ON "CleanPageEntry"("publicId");
  `);
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const expected = process.env.MIGRATION_TOKEN;

  if (expected && token !== expected) return unauthorized();

  try {
    await runMigration();
    return NextResponse.json({ ok: true, migrated: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown migration error";
    return NextResponse.json({ ok: false, error: "MIGRATION_FAILED", message }, { status: 500 });
  }
}
