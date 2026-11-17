"use client";

import React, { useMemo } from "react";
import { Marked } from "marked";

/**
 * Strips any markdown link syntax or brackets from an anchor string
 * to prevent nested link wrapping e.g. [[[anchor](url)](url)] -> anchor
 */
function cleanAnchorText(anchor) {
  if (!anchor || typeof anchor !== "string") return "";
  let clean = anchor.trim();
  while (/\[([^\]]+)\]\([^)]+\)/.test(clean)) {
    clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  }
  clean = clean.replace(/^\[+/, "").replace(/\]+$/, "").trim();
  return clean;
}

/**
 * Recursively unwraps nested markdown links:
 * e.g. [[[anchor](url)](url)](url) -> [anchor](url)
 */
function unwrapNestedMarkdownLinks(str) {
  if (!str) return "";
  let prev = "";
  let curr = str;
  while (curr !== prev) {
    prev = curr;
    curr = curr.replace(/\[\s*\[([^\]]+)\]\(([^)]+)\)\s*\]\(([^)]+)\)/g, "[$1]($2)");
    curr = curr.replace(/\[\s*(\[[^\]]+\]\([^)]+\))\s*\](?:\([^)]*\))?/g, "$1");
  }
  return curr;
}

function cleanFormattingMarks(text) {
  if (!text) return "";
  return text.replace(/^(\*{1,3}|_{1,3})/, "").replace(/(\*{1,3}|_{1,3})$/, "").trim();
}

/**
 * Normalizes an anchor name into a canonical key:
 * - Strips formatting marks (*, _, etc.)
 * - Strips diacritics / accents (e.g. ō -> o)
 * - Lowercases and trims
 * Ensures no duplicate backlinks exist for the same anchor name.
 */
function getCanonicalAnchorKey(anchor) {
  if (!anchor || typeof anchor !== "string") return "";
  const cleaned = cleanAnchorText(anchor);
  const bare = cleanFormattingMarks(cleaned);
  return bare
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Builds a regex pattern that matches both accented and unaccented versions of vowels
 */
function makeDiacriticInsensitivePattern(str) {
  if (!str || typeof str !== "string") return "";
  const accentMap = {
    a: "[aàáâãäåāǎ]",
    e: "[eèéêëēě]",
    i: "[iìíîïīǐ]",
    o: "[oòóôõöōǒø]",
    u: "[uùúûüūǔ]",
    c: "[cçćč]",
    n: "[nñńň]",
    s: "[sśšş]",
    y: "[yýÿ]",
    z: "[zźžż]",
  };

  const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let pattern = "";
  for (const ch of escaped) {
    const base = ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (accentMap[base]) {
      pattern += accentMap[base];
    } else {
      pattern += ch;
    }
  }
  return pattern;
}

/**
 * Deduplicates backlinks strictly by canonical anchor name so no duplicate
 * backlinks exist for the same anchor name.
 */
function deduplicateBacklinks(backlinks) {
  if (!Array.isArray(backlinks)) return [];
  const seenKeys = new Set();
  const result = [];
  for (const b of backlinks) {
    if (!b || !b.anchor || !b.url) continue;
    const anchor = typeof b.anchor === "string" ? cleanAnchorText(b.anchor) : "";
    const url = typeof b.url === "string" ? b.url.trim() : "";
    if (!anchor || !url) continue;

    const key = getCanonicalAnchorKey(anchor);
    if (!key) continue;

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push({ anchor, url });
    }
  }
  return result;
}

/**
 * Converts legacy separate backlinks array into inline Markdown links if the text
 * does not already contain Markdown links. Prevents duplicate and nested link wrapping.
 */
function convertLegacyBacklinksToMarkdown(para, backlinks) {
  if (!para) return "";

  // 1. Unwrap any pre-existing nested markdown links
  let result = unwrapNestedMarkdownLinks(para);

  const validBacklinks = deduplicateBacklinks(backlinks);
  if (validBacklinks.length === 0) return result;

  for (const b of validBacklinks) {
    const anchor = cleanAnchorText(b.anchor);
    const url = b.url;
    const unformatted = cleanFormattingMarks(anchor);
    if (!unformatted) continue;
    const diacriticPattern = makeDiacriticInsensitivePattern(unformatted);
    const escapedExact = anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match existing markdown links OR bare target anchor (including accent variations)
    // If inside an existing markdown link, leave it untouched to avoid nested links!
    const pattern = new RegExp(
      "(\\[[^\\]]+\\]\\([^)]+\\))|(" + escapedExact + "|" + diacriticPattern + ")",
      "gi"
    );

    result = result.replace(pattern, (match, existingLink, bareAnchor) => {
      if (existingLink) {
        return existingLink;
      }
      return `[${bareAnchor}](${url})`;
    });
  }

  return unwrapNestedMarkdownLinks(result);
}

// Custom renderer for marked to style links
const customRenderer = {
  link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
    const titleAttr = title ? ` title="${title}"` : "";
    const targetRel = isInternal ? "" : ' target="_blank" rel="noopener noreferrer"';
    return `<a href="${href || "#"}" class="text-[#1a56db] hover:text-[#0c326f] underline font-medium cursor-pointer transition-colors"${titleAttr}${targetRel}>${text}</a>`;
  },
};

const customMarked = new Marked({
  gfm: true,
  breaks: true,
  renderer: customRenderer,
});

/**
 * Public Blog Markdown Renderer
 * Parses and renders Markdown (bold, italic, bold+italic, links, bullet points, headings, blockquotes, code)
 * according to standard Markdown specifications, properly formatting overflowing text.
 */
export default function InlineBacklinksText({ para = "", backlinks = [] }) {
  if (!para) return null;

  const html = useMemo(() => {
    // 1. Convert legacy separate backlinks into markdown links if needed without nesting
    const withLinks = convertLegacyBacklinksToMarkdown(para, backlinks);

    // 2. Normalize bullet points • into - so marked renders proper <ul> lists
    const normalized = withLinks.replace(/^(\s*)•\s+/gm, "$1- ");

    // 3. Parse with custom marked instance
    return customMarked.parse(normalized);
  }, [para, backlinks]);

  return (
    <div
      className="space-y-3 break-words [overflow-wrap:anywhere]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
