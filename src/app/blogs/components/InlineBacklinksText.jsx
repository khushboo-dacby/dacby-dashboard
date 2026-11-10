import React from "react";
import Link from "next/link";

/**
 * Replaces backlink anchors inside a paragraph with clickable Next.js Links
 */
export default function InlineBacklinksText({ para = "", backlinks = [] }) {
  if (!backlinks || backlinks.length === 0 || !para) {
    return <span>{para}</span>;
  }

  // Filter valid backlinks with non-empty anchor
  const validBacklinks = backlinks.filter(
    (b) => b && b.anchor && typeof b.anchor === "string" && b.anchor.trim() !== ""
  );

  if (validBacklinks.length === 0) {
    return <span>{para}</span>;
  }

  // Escape regex special chars
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Build pattern
  const pattern = new RegExp(
    `(${validBacklinks.map((b) => escapeRegex(b.anchor)).join("|")})`,
    "g"
  );

  const parts = para.split(pattern);

  return (
    <span>
      {parts.map((part, index) => {
        const match = validBacklinks.find(
          (b) => b.anchor.toLowerCase() === part.toLowerCase()
        );
        if (match) {
          return (
            <Link
              key={index}
              href={match.url || "#"}
              className="text-[#1A56DB] hover:text-[#0C326F] underline font-medium transition-colors cursor-pointer"
            >
              {part}
            </Link>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
