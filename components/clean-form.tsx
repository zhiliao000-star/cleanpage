"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { cleanUrlAction, type FormState } from "@/app/actions";

const samples = [
  "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
  "https://en.wikipedia.org/wiki/Readability",
  "https://nextjs.org/docs",
];

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      disabled={pending}
    >
      {pending ? "Cleaning…" : "Clean"}
    </button>
  );
}

export function CleanForm() {
  const [state, formAction] = useActionState(cleanUrlAction, initialState);
  const [value, setValue] = useState("");

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
      <form action={formAction} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Page URL</span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              name="url"
              placeholder="https://example.com/article"
              required
              inputMode="url"
              autoComplete="url"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
            <SubmitButton />
          </div>
        </label>

        <p className="text-sm text-slate-500">We fetch the page, extract readable content, convert it to Markdown, and give you a tiny share link.</p>

        {state.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</p>
        ) : null}
      </form>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Try one</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {samples.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setValue(sample)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
