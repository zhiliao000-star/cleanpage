import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

import { prisma } from "@/lib/prisma";
import { generatePublicId, isValidHttpUrl } from "@/lib/utils";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

turndown.addRule("preformattedLinks", {
  filter: ["a"],
  replacement(content, node) {
    const href = node.getAttribute("href");
    if (!href) return content;
    return `[${content || href}](${href})`;
  },
});

export class CleanPageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CleanPageError";
  }
}

export async function createCleanPageEntry(sourceUrl: string) {
  if (!isValidHttpUrl(sourceUrl)) {
    throw new CleanPageError("Please enter a valid http(s) URL.");
  }

  const response = await fetch(sourceUrl, {
    headers: {
      "User-Agent": "CleanPageBot/1.0 (+https://cleanpage.local)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new CleanPageError(`Failed to fetch the page (${response.status}).`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
    throw new CleanPageError("This URL did not return an HTML page.");
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url: sourceUrl });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article?.content) {
    throw new CleanPageError("Could not extract readable content from that page.");
  }

  const markdown = turndown.turndown(article.content).trim();
  const title = (article.title || dom.window.document.title || sourceUrl).trim();

  if (!markdown) {
    throw new CleanPageError("The extracted page was empty.");
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const publicId = generatePublicId();

    try {
      return await prisma.cleanPageEntry.create({
        data: {
          publicId,
          sourceUrl,
          title,
          markdown,
        },
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error &&
        "code" in error &&
        error.code === "P2002"
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new CleanPageError("Could not generate a unique share ID. Please try again.");
}
