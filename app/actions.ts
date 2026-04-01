"use server";

import { redirect } from "next/navigation";

import { CleanPageError, createCleanPageEntry } from "@/lib/clean";

export type FormState = {
  error?: string;
};

export async function cleanUrlAction(_: FormState, formData: FormData): Promise<FormState> {
  const sourceUrl = String(formData.get("url") || "").trim();

  try {
    const entry = await createCleanPageEntry(sourceUrl);
    redirect(`/${entry.publicId}`);
  } catch (error) {
    if (error instanceof CleanPageError) {
      return { error: error.message };
    }

    return { error: "Something went wrong while cleaning that page. Please try again." };
  }
}
