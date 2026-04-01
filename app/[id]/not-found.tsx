import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Missing page</p>
        <h1 className="text-3xl font-semibold text-slate-950">That CleanPage link doesn&apos;t exist.</h1>
        <p className="text-slate-600">It may have been mistyped, expired, or never created.</p>
        <Link href="/" className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          Go home
        </Link>
      </div>
    </main>
  );
}
