import { CleanForm } from "@/components/clean-form";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-6">
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            CleanPage
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Paste a link. Get a clean page.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Drop in any article or documentation URL. CleanPage strips the clutter, keeps the readable content, turns it into Markdown, and saves a tiny shareable page.
            </p>
          </div>
        </section>

        <section>
          <CleanForm />
        </section>
      </div>
    </main>
  );
}
