import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-3 px-5 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-zinc-600">This CleanPage link does not exist.</p>
      <Link href="/" className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-100">
        Go home
      </Link>
    </main>
  );
}
