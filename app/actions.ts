"use server";

import { redirect } from "next/navigation";

import { CleanPageError, createCleanPageEntry } from "@/lib/clean";

export type FormState = {
  error?: string;
};

function asPrismaCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = (error as { code?: string }).code;
    if (typeof code === "string") return code;
  }
  return null;
}

export async function cleanUrlAction(_: FormState, formData: FormData): Promise<FormState> {
  const sourceUrl = String(formData.get("url") || "").trim();

  try {
    const entry = await createCleanPageEntry(sourceUrl);
    redirect(`/${entry.publicId}`);
  } catch (error) {
    if (error instanceof CleanPageError) {
      return { error: error.message };
    }

    const code = asPrismaCode(error);

    if (code === "P2021") {
      return {
        error: JSON.stringify({
          error: "TABLE_NOT_FOUND",
          message: "Please run prisma db push",
        }),
      };
    }

    if (code === "P1001") {
      return {
        error: JSON.stringify({
          error: "CONNECTION_FAILED",
          port: "6543",
        }),
      };
    }

    return { error: "Something went wrong while cleaning that page. Please try again." };
  }
}
