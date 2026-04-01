import * as cheerio from "cheerio";
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

function extractContent(html: string, sourceUrl: string) {
  const $ = cheerio.load(html);

  const title =
    $("meta[property='og:title']").attr("content")?.trim() ||
    $("title").text().trim() ||
    sourceUrl;

  $(
    "script,style,noscript,iframe,svg,canvas,form,nav,header,footer,aside,.sidebar,.advertisement,.ads,.cookie,.modal,.popup",
  ).remove();

  const articleHtml =
    $("article").first().html() ||
    $("main").first().html() ||
    $("[role='main']").first().html() ||
    $("body").html() ||
    "";

  const markdown = turndown.turndown(articleHtml).trim();

  return {
    title,
    markdown,
  };
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
  const { title, markdown } = extractContent(html, sourceUrl);

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
