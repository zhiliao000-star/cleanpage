import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export async function extractToMarkdown(sourceUrl: string) {
  const res = await fetch(sourceUrl, {
    headers: {
      "User-Agent": "CleanPageBot/1.0 (+https://cleanpage.local)",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch source page.");

  const html = await res.text();
  const dom = new JSDOM(html, { url: sourceUrl });
  const article = new Readability(dom.window.document).parse();

  if (!article?.content) throw new Error("Could not extract readable content.");

  const markdown = turndown.turndown(article.content).trim();
  if (!markdown) throw new Error("Extracted content was empty.");

  return {
    title: article.title?.trim() || "Untitled",
    markdown,
  };
}
