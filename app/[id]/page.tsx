import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CopyButton } from "@/components/copy-button";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getEntry(publicId: string) {
  return prisma.cleanPageEntry.findUnique({
    where: { publicId },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = await getEntry(id);

  if (!entry) {
    return { title: "Not found | CleanPage" };
  }

  return {
    title: `${entry.title} | CleanPage`,
    description: `Cleaned copy of ${entry.sourceUrl}`,
  };
}

export default async function CleanPageEntryPage({ params }: PageProps) {
  const { id } = await params;
  const entry = await getEntry(id);

  if (!entry) {
    notFound();
  }

  const shareLink = absoluteUrl(`/${entry.publicId}`);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
        ← Back to CleanPage
      </Link>

      <header className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Clean result</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{entry.title}</h1>
          <a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="break-all text-sm text-slate-500 underline-offset-4 hover:underline">
            {entry.sourceUrl}
          </a>
        </div>

        <div className="flex flex-wrap gap-3">
          <CopyButton label="Copy markdown" value={entry.markdown} />
          <CopyButton label="Copy share link" value={shareLink} />
        </div>
      </header>

      <article className="prose prose-slate max-w-none rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] prose-headings:scroll-mt-20 prose-pre:overflow-x-auto prose-a:text-sky-700">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.markdown}</ReactMarkdown>
      </article>
    </main>
  );
}
