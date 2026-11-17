"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  GripVertical,
  Undo,
  Redo,
} from "lucide-react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import styles from "../styles/addBlog.module.css";
import { addBlog, editBlog, getBlogs, getBlogById } from "../apis/api";
import { toCDN } from "../helper";
import SortableSectionCard from "../components/SortableSectionCard";
import { useBlogHistory, cloneBlogState } from "../blogHistory";
import {
  getStoredBlogs,
  appendContentToBlog,
  DUMMY_BLOG_IMAGE
} from "../data/mockBlogs";

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
 * Extracts all inline markdown hyperlinks [anchor](url) into backlink objects.
 * Accurately supports:
 * - *text*     => Italic
 * - **text**   => Bold
 * - ***text*** => Bold + Italic
 */
function extractLinksFromMarkdown(markdown) {
  if (!markdown) return [];
  const cleanMarkdown = unwrapNestedMarkdownLinks(markdown);
  const regex = /(\*{1,3}|_{1,3})?\[([^\]]+)\]\(([^)]+)\)(\*{1,3}|_{1,3})?/g;
  const links = [];
  const seenKeys = new Set();
  let match;
  while ((match = regex.exec(cleanMarkdown)) !== null) {
    const prefix = match[1] || "";
    const rawAnchor = match[2].trim();
    const url = match[3].trim();
    const suffix = match[4] || "";

    let anchor = rawAnchor;

    const isBoldItalic = prefix === "***" || suffix === "***" || rawAnchor.includes("***");
    const isBold = !isBoldItalic && (prefix === "**" || suffix === "**" || rawAnchor.includes("**"));
    const isItalic =
      !isBoldItalic &&
      !isBold &&
      (prefix === "*" ||
        suffix === "*" ||
        prefix === "_" ||
        suffix === "_" ||
        (rawAnchor.startsWith("*") && rawAnchor.endsWith("*")) ||
        (rawAnchor.startsWith("_") && rawAnchor.endsWith("_")));

    if (isBoldItalic) {
      anchor = `***${cleanFormattingMarks(rawAnchor)}***`;
    } else if (isBold) {
      anchor = `**${cleanFormattingMarks(rawAnchor)}**`;
    } else if (isItalic) {
      anchor = `*${cleanFormattingMarks(rawAnchor)}*`;
    }

    const key = getCanonicalAnchorKey(anchor);
    if (key && !seenKeys.has(key)) {
      seenKeys.add(key);
      links.push({
        anchor,
        url,
      });
    }
  }
  return links;
}

/**
 * Formats paragraph content for the API payload:
 * - *text*                     => Italic
 * - **text**                   => Bold
 * - ***text***                 => Bold + Italic
 * - \n                         => Next line preserved
 * - - or *                     => Bullet points (•) with proper formatting for overflowing text
 * - Hyperlinks                 => Completely removed from body text, stored in backlinks array
 */
function formatParaForPayload(markdown) {
  if (!markdown) return "";

  // 1. First unwrap any nested links
  let text = unwrapNestedMarkdownLinks(markdown);

  // 2. Strip all markdown link URLs [anchor](url), keeping the formatted anchor
  let prev = "";
  const linkRegex = /(\*{1,3}|_{1,3})?\[([^\]]+)\]\([^)]+\)(\*{1,3}|_{1,3})?/g;
  while (text !== prev) {
    prev = text;
    text = text.replace(linkRegex, (match, prefix = "", anchor = "", suffix = "") => {
      const rawAnchor = anchor.trim();
      const isBoldItalic = prefix === "***" || suffix === "***" || rawAnchor.includes("***");
      const isBold = !isBoldItalic && (prefix === "**" || suffix === "**" || rawAnchor.includes("**"));
      const isItalic =
        !isBoldItalic &&
        !isBold &&
        (prefix === "*" ||
          suffix === "*" ||
          prefix === "_" ||
          suffix === "_" ||
          (rawAnchor.startsWith("*") && rawAnchor.endsWith("*")) ||
          (rawAnchor.startsWith("_") && rawAnchor.endsWith("_")));

      const clean = cleanFormattingMarks(rawAnchor);

      if (isBoldItalic) return `***${clean}***`;
      if (isBold) return `**${clean}**`;
      if (isItalic) return `*${clean}*`;
      return clean;
    });
  }

  // 3. Final safety cleanup: remove any leftover brackets with url
  text = text.replace(/\[+([^\]]+)\]+\([^)]+\)/g, "$1");

  // 4. Convert bullet points: lines starting with "- " or "* " to "• "
  // Handles single and multi-level indentation and line breaks cleanly
  const lines = text.split("\n");
  const formattedLines = lines.map((line) => {
    const bulletMatch = line.match(/^(\s*)([-*])\s+(.+)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1];
      const content = bulletMatch[3].trim();
      return `${indent}• ${content}`;
    }
    return line;
  });

  return formattedLines.join("\n").trim();
}

/**
 * Converts legacy separate backlinks and bullet characters into Markdown for Tiptap editor
 * for seamless compatibility when loading existing articles.
 */
function normalizeSection(sec, index = 0) {
  let para = sec.para || "";

  // 1. Unwrap any nested links
  para = unwrapNestedMarkdownLinks(para);

  // 2. Convert bullet point character • back to markdown dash - for Tiptap rich text editor
  para = para.replace(/^(\s*)•\s+/gm, "$1- ");

  // 3. If backlinks exist, safely linkify anchors without nested wrapping
  if (Array.isArray(sec.backlinks) && sec.backlinks.length > 0) {
    const validBacklinks = deduplicateBacklinks(sec.backlinks);

    for (const b of validBacklinks) {
      const anchor = cleanAnchorText(b.anchor);
      const url = b.url;
      const unformatted = cleanFormattingMarks(anchor);
      if (!unformatted) continue;
      const diacriticPattern = makeDiacriticInsensitivePattern(unformatted);
      const escapedExact = anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const pattern = new RegExp(
        "(\\[[^\\]]+\\]\\([^)]+\\))|(" + escapedExact + "|" + diacriticPattern + ")",
        "gi"
      );

      para = para.replace(pattern, (match, existingLink, bareAnchor) => {
        if (existingLink) return existingLink;
        return `[${bareAnchor}](${url})`;
      });
    }
  }

  para = unwrapNestedMarkdownLinks(para);
  const inlineLinks = extractLinksFromMarkdown(para);
  const finalBacklinks = deduplicateBacklinks(
    inlineLinks.length > 0 ? inlineLinks : (Array.isArray(sec.backlinks) ? sec.backlinks : [])
  );

  return {
    _uid: sec._uid || `sec-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    heading: sec.heading || "",
    para,
    image: sec.image || "",
    backlinks: finalBacklinks,
  };
}

// Synchronously resolve cached blog data to instantly populate UI (0ms delay)
function getCachedActiveBlog(targetId) {
  if (typeof window === "undefined" || !targetId) return null;
  // 1. Try sessionStorage active_blog_data
  try {
    const stored = sessionStorage.getItem("active_blog_data");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && String(parsed.id) === String(targetId)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to parse cached active_blog_data:", e);
  }

  // 2. Try stored local mock blogs as synchronous fallback
  try {
    const storedBlogs = getStoredBlogs();
    if (Array.isArray(storedBlogs)) {
      const matched = storedBlogs.find((b) => String(b.id) === String(targetId));
      if (matched) return matched;
    }
  } catch (e) {}

  return null;
}

function PostBlogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBlogId = searchParams?.get("blogId") || "";
  const isEditMode = searchParams?.get("edit") === "true";
  const fromParam = searchParams?.get("from") || "";

  // Use SWR to leverage existing in-memory cache of blogs list
  const { data: swrBlogs } = useSWR("blogs-list", {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const [cachedActiveBlog, setCachedActiveBlog] = useState(() =>
    getCachedActiveBlog(preselectedBlogId)
  );

  const [existingBlogs, setExistingBlogs] = useState(() => {
    const list = [];
    const active = getCachedActiveBlog(preselectedBlogId);
    if (active) {
      list.push(active);
    }
    if (typeof window !== "undefined") {
      try {
        const stored = getStoredBlogs();
        if (Array.isArray(stored)) {
          stored.forEach((b) => {
            if (!list.some((item) => String(item.id) === String(b.id))) {
              list.push(b);
            }
          });
        }
      } catch {}
    }
    return list;
  });

  const [mode, setMode] = useState(
    isEditMode && preselectedBlogId ? "edit" : preselectedBlogId ? "existing" : "new"
  );
  const [selectedBlogId, setSelectedBlogId] = useState(preselectedBlogId);

  // General Blog Meta - instantly populated if editing
  const [hashtag, setHashtag] = useState(() => {
    const active = getCachedActiveBlog(preselectedBlogId);
    if (isEditMode && active) {
      if (Array.isArray(active.hashtags)) {
        return active.hashtags.join(", ");
      }
      if (typeof active.hashtags === "string") {
        return active.hashtags;
      }
    }
    return "";
  });

  const [topImageUrl, setTopImageUrl] = useState(() => {
    const active = getCachedActiveBlog(preselectedBlogId);
    if (isEditMode && active) {
      return active.top_image || "";
    }
    return "";
  });

  // Content Sections - instantly populated if editing
  const [sections, setSections] = useState(() => {
    const active = getCachedActiveBlog(preselectedBlogId);
    if (
      isEditMode &&
      active &&
      Array.isArray(active.content) &&
      active.content.length > 0
    ) {
      return active.content.map(normalizeSection);
    }
    return [
      {
        _uid: `sec-${Date.now()}-0`,
        heading: "",
        para: "",
        image: "",
        backlinks: []
      }
    ];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImgError, setCoverImgError] = useState(false);

  // Centralized session identifier for undo / redo history isolation
  const sessionKey =
    mode === "edit"
      ? `edit_${preselectedBlogId || selectedBlogId || "current"}`
      : mode === "existing"
      ? `existing_${selectedBlogId || "current"}`
      : "new_blog";

  const handleApplyState = useCallback((restoredState) => {
    if (!restoredState) return;
    if (typeof restoredState.hashtag === "string") {
      setHashtag(restoredState.hashtag);
    }
    if (typeof restoredState.topImageUrl === "string") {
      setTopImageUrl(restoredState.topImageUrl);
      setCoverImgError(false);
    }
    if (Array.isArray(restoredState.sections)) {
      setSections(restoredState.sections);
    }
    if (restoredState.selectedBlogId) {
      setSelectedBlogId(restoredState.selectedBlogId);
    }
  }, []);

  const {
    canUndo,
    canRedo,
    undo,
    redo,
    recordChange,
    setInitialBaseline,
    commitPendingTyping,
    clearSession,
  } = useBlogHistory({
    sessionKey,
    initialState: {
      hashtag,
      topImageUrl,
      selectedBlogId,
      sections,
    },
    onApplyState: handleApplyState,
  });

  // Global Keyboard Shortcuts: Ctrl+Z / Cmd+Z (Undo) and Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y (Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;

      const isShift = e.shiftKey;
      const key = e.key.toLowerCase();

      // Undo: Ctrl+Z or Cmd+Z (without Shift)
      if (key === "z" && !isShift) {
        if (canUndo) {
          e.preventDefault();
          e.stopPropagation();
          undo();
        }
      }
      // Redo: Ctrl+Shift+Z, Cmd+Shift+Z, Ctrl+Y, or Cmd+Y
      else if ((key === "z" && isShift) || (key === "y" && !isShift)) {
        if (canRedo) {
          e.preventDefault();
          e.stopPropagation();
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [canUndo, canRedo, undo, redo]);

  const getReturnPath = () => {
    if (fromParam) return fromParam;
    if (typeof window !== "undefined") {
      const storedSource = sessionStorage.getItem("blog_nav_source");
      if (storedSource) return storedSource;
    }
    if (preselectedBlogId) {
      return `/blogs/${preselectedBlogId}`;
    }
    return "/blogs";
  };

  const handleCancel = () => {
    const targetPath = getReturnPath();
    router.push(targetPath);
  };

  // Sync with SWR cache if blogs list exists in memory
  useEffect(() => {
    if (Array.isArray(swrBlogs) && swrBlogs.length > 0) {
      setExistingBlogs((prev) => {
        const map = new Map();
        if (cachedActiveBlog) {
          map.set(String(cachedActiveBlog.id), cachedActiveBlog);
        }
        swrBlogs.forEach((b) => map.set(String(b.id), b));
        return Array.from(map.values());
      });
    }
  }, [swrBlogs, cachedActiveBlog]);

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialData() {
      let list = [];
      try {
        const res = await getBlogs();
        if (res?.blogs && Array.isArray(res.blogs)) {
          list = res.blogs;
          if (!isCancelled) {
            setExistingBlogs((prev) => {
              const map = new Map();
              if (cachedActiveBlog) {
                map.set(String(cachedActiveBlog.id), cachedActiveBlog);
              }
              res.blogs.forEach((b) => map.set(String(b.id), b));
              return Array.from(map.values());
            });
          }
        }
      } catch (e) {
        console.warn("Could not fetch remote blogs list:", e);
      }

      if (!list.length) {
        list = getStoredBlogs();
        if (!isCancelled) {
          setExistingBlogs((prev) => (prev.length > 0 ? prev : list));
        }
      }

      if (preselectedBlogId) {
        setSelectedBlogId(preselectedBlogId);

        if (isEditMode) {
          setMode("edit");
          let targetBlog =
            cachedActiveBlog || list.find((b) => String(b.id) === String(preselectedBlogId));
          if (!targetBlog) {
            try {
              targetBlog = await getBlogById(preselectedBlogId);
            } catch (err) {
              console.error("Could not fetch blog detail for edit:", err);
            }
          }

          if (targetBlog && !isCancelled) {
            try {
              sessionStorage.setItem("active_blog_data", JSON.stringify(targetBlog));
            } catch {}
            setCachedActiveBlog(targetBlog);

            // If not already filled from cache, populate now
            if (!cachedActiveBlog) {
              const loadedHashtag = Array.isArray(targetBlog.hashtags)
                ? targetBlog.hashtags.join(", ")
                : typeof targetBlog.hashtags === "string"
                ? targetBlog.hashtags
                : "";
              const loadedTopImg = targetBlog.top_image || "";
              const loadedSections =
                Array.isArray(targetBlog.content) && targetBlog.content.length > 0
                  ? targetBlog.content.map(normalizeSection)
                  : sections;

              setHashtag(loadedHashtag);
              setTopImageUrl(loadedTopImg);
              setSections(loadedSections);

              setInitialBaseline({
                hashtag: loadedHashtag,
                topImageUrl: loadedTopImg,
                selectedBlogId: preselectedBlogId,
                sections: loadedSections,
              });
            }
          }
        } else {
          setMode("existing");
        }
      } else if (list.length > 0 && !selectedBlogId) {
        setSelectedBlogId(list[0].id);
      }
    }

    loadInitialData();

    return () => {
      isCancelled = true;
    };
  }, [preselectedBlogId, isEditMode]);

  const handleAddSection = () => {
    const newSection = {
      _uid: `sec-${Date.now()}-${sections.length}-${Math.random().toString(36).slice(2, 6)}`,
      heading: "",
      para: "",
      image: "",
      backlinks: [],
    };
    const nextSections = [...sections, newSection];
    setSections(nextSections);
    recordChange(
      {
        hashtag,
        topImageUrl,
        sections: nextSections,
        selectedBlogId,
      },
      { isDiscrete: true }
    );
  };

  const handleRemoveSection = (index) => {
    if (sections.length <= 1) {
      toast.error("At least one section is required.");
      return;
    }
    const nextSections = sections.filter((_, i) => i !== index);
    setSections(nextSections);
    recordChange(
      {
        hashtag,
        topImageUrl,
        sections: nextSections,
        selectedBlogId,
      },
      { isDiscrete: true }
    );
  };

  const handleSectionChange = (index, field, value) => {
    setSections((prev) => {
      const copy = [...prev];
      const updatedSection = { ...copy[index], [field]: value };
      if (field === "para") {
        updatedSection.backlinks = deduplicateBacklinks(extractLinksFromMarkdown(value));
      }
      copy[index] = updatedSection;

      recordChange(
        {
          hashtag,
          topImageUrl,
          sections: copy,
          selectedBlogId,
        },
        { isDiscrete: false }
      );

      return copy;
    });
  };

  const handleCategoryChange = (val) => {
    setHashtag(val);
    recordChange(
      {
        hashtag: val,
        topImageUrl,
        sections,
        selectedBlogId,
      },
      { isDiscrete: false }
    );
  };

  const handleCoverImageChange = (val) => {
    setTopImageUrl(val);
    setCoverImgError(false);
    recordChange(
      {
        hashtag,
        topImageUrl: val,
        sections,
        selectedBlogId,
      },
      { isDiscrete: false }
    );
  };

  const handleTargetBlogChange = (val) => {
    setSelectedBlogId(val);
    recordChange(
      {
        hashtag,
        topImageUrl,
        sections,
        selectedBlogId: val,
      },
      { isDiscrete: true }
    );
  };

  const handleModeSwitch = (newMode) => {
    commitPendingTyping();
    setMode(newMode);
  };

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item._uid === active.id);
        const newIndex = items.findIndex((item) => item._uid === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(items, oldIndex, newIndex);
          recordChange(
            {
              hashtag,
              topImageUrl,
              sections: reordered,
              selectedBlogId,
            },
            { isDiscrete: true }
          );
          return reordered;
        }
        return items;
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeSection = sections.find((s) => s._uid === activeId);
  const activeIndex = sections.findIndex((s) => s._uid === activeId);

  const selectedBlog =
    existingBlogs.find((b) => String(b.id) === String(selectedBlogId)) ||
    (cachedActiveBlog && String(cachedActiveBlog.id) === String(selectedBlogId)
      ? cachedActiveBlog
      : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    commitPendingTyping();

    const cleanedSections = sections.map((sec) => {
      const trimmedHeading = sec.heading.trim();
      const rawPara = sec.para.trim();
      const inlineLinks = extractLinksFromMarkdown(rawPara);
      const cleanPara = formatParaForPayload(rawPara);
      const sourceBacklinks = inlineLinks.length > 0
        ? inlineLinks
        : (Array.isArray(sec.backlinks) ? sec.backlinks : []);
      const finalBacklinks = deduplicateBacklinks(sourceBacklinks);

      return {
        heading: trimmedHeading,
        para: cleanPara,
        image: toCDN(sec.image ? sec.image.trim() : ""),
        backlinks: finalBacklinks,
      };
    });

    if (cleanedSections.some((sec) => !sec.heading || !sec.para)) {
      toast.error("Please provide both heading and paragraph for all sections.");
      return;
    }

    setIsSubmitting(true);

    if (mode === "edit") {
      const editBlogPayload = {
        id: selectedBlogId || preselectedBlogId,
        content: cleanedSections,
        hashtags: hashtag.trim()
          ? hashtag.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        top_image: toCDN(topImageUrl.trim()),
        visible: true,
      };

      console.log("Submitting editBlogPayload to Cloud Function API:", JSON.stringify(editBlogPayload, null, 2));

      try {
        const response = await editBlog(editBlogPayload);
        if (response?.success) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("refresh_blogs", "true");
            sessionStorage.setItem(`refresh_blog_${editBlogPayload.id}`, "true");
          }
          mutate(`blog-detail:${editBlogPayload.id}`);
          mutate("blogs-list");
          clearSession();
          toast.success(response.message || "Blog updated successfully.");
          setTimeout(() => {
            router.push(`/blogs/${editBlogPayload.id}`);
          }, 300);
        } else {
          toast.error(response?.message || "Failed to update blog.");
        }
      } catch (apiError) {
        toast.error(apiError?.message || "Error updating blog in database.");
        console.error("Edit blog API error:", apiError);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === "new") {
      // 1. Generate the exact API payload for adding a new blog with purely user input (no dummy data)
      // Contract: POST https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi/api/blogs/add
      const addBlogPayload = {
        content: cleanedSections,
        hashtags: hashtag.trim()
          ? hashtag.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        top_image: toCDN(topImageUrl.trim()),
        visible: true,
      };

      console.log("Generated addBlogPayload for Cloud Function API:", JSON.stringify(addBlogPayload, null, 2));

      try {
        const response = await addBlog(addBlogPayload);
        if (response?.success) {
          const createdId = response.id;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("refresh_blogs", "true");
            if (createdId) {
              sessionStorage.setItem(`refresh_blog_${createdId}`, "true");
            }
          }
          mutate("blogs-list");
          clearSession();
          toast.success(response.message || "Blog added successfully.");
          setTimeout(() => {
            router.push(createdId ? `/blogs/${createdId}` : "/blogs");
          }, 300);
        } else {
          toast.error(response?.message || "Failed to publish blog.");
        }
      } catch (apiError) {
        toast.error(apiError?.message || "Error publishing blog to database.");
        console.error("Add blog API error:", apiError);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!selectedBlogId) {
        toast.error("Please select a target blog.");
        setIsSubmitting(false);
        return;
      }

      // Generate the exact API payload for editing/appending to an existing blog
      // Contract: POST https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi/api/blogs/edit
      const editBlogPayload = {
        id: selectedBlogId,
        content: [
          ...(selectedBlog?.content || []).map((sec) => ({
            ...sec,
            image: toCDN(sec.image || ""),
            para: formatParaForPayload(sec.para || ""),
            backlinks: deduplicateBacklinks(
              Array.isArray(sec.backlinks) && sec.backlinks.length > 0
                ? sec.backlinks
                : extractLinksFromMarkdown(sec.para || "")
            ),
          })),
          ...cleanedSections,
        ],
        visible: true,
      };

      console.log("Generated editBlogPayload for Cloud Function API:", JSON.stringify(editBlogPayload, null, 2));

      try {
        const response = await editBlog(editBlogPayload);
        if (response?.success) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("refresh_blogs", "true");
            sessionStorage.setItem(`refresh_blog_${selectedBlogId}`, "true");
          }
          mutate(`blog-detail:${selectedBlogId}`);
          mutate("blogs-list");
          clearSession();
          toast.success(response.message || "Blog updated successfully.");
          setTimeout(() => {
            router.push(`/blogs/${selectedBlogId}`);
          }, 300);
          return;
        } else {
          toast.error(response?.message || "Failed to update blog.");
        }
      } catch (apiError) {
        toast.error(apiError.message || "Error updating blog in database.");
        console.error("Edit blog API error:", apiError);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Bar with Back Navigation & Main History Controls */}
      <div className={styles.topToolbarRow}>
        <button
          type="button"
          onClick={handleCancel}
          className={styles.backLink}
        >
          <ArrowLeft size={15} />
          <span>
            {getReturnPath() === "/blogs"
              ? "Back to blogs"
              : getReturnPath().startsWith("/blogs/")
              ? "Back to article"
              : "Back"}
          </span>
        </button>

        {/* Global Undo / Redo Toolbar */}
        <div
          className={styles.globalHistoryToolbar}
          role="toolbar"
          aria-label="Blog global history controls"
        >
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className={`${styles.globalHistoryBtn} ${
              !canUndo ? styles.globalHistoryBtnDisabled : ""
            }`}
            title="Undo blog changes (Ctrl+Z / Cmd+Z)"
            aria-label="Undo blog changes (Ctrl+Z / Cmd+Z)"
          >
            <Undo size={15} />
            <span className={styles.globalHistoryBtnLabel}>Undo</span>
          </button>
          <span className={styles.globalHistoryDivider} />
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className={`${styles.globalHistoryBtn} ${
              !canRedo ? styles.globalHistoryBtnDisabled : ""
            }`}
            title="Redo blog changes (Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y)"
            aria-label="Redo blog changes (Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y)"
          >
            <Redo size={15} />
            <span className={styles.globalHistoryBtnLabel}>Redo</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>
          {mode === "edit"
            ? "Edit Blog Post"
            : mode === "new"
            ? "Create Blog Post"
            : "Add Section to Blog"}
        </h1>
        <p className={styles.bannerSubtitle}>
          {mode === "edit"
            ? "Modify article details, content sections, and backlinks."
            : mode === "new"
            ? "Configure article details, sections, and links."
            : "Append new content sections to an existing article."}
        </p>
      </div>

      {/* Mode Switcher */}
      {mode !== "edit" && (
        <nav className={styles.modeTabs} aria-label="Creation mode">
          <button
            type="button"
            onClick={() => handleModeSwitch("new")}
            className={`${styles.modeTabButton} ${
              mode === "new" ? styles.modeTabActive : styles.modeTabInactive
            }`}
          >
            Create New Blog
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("existing")}
            className={`${styles.modeTabButton} ${
              mode === "existing" ? styles.modeTabActive : styles.modeTabInactive
            }`}
          >
            Add to Existing Blog
          </button>
        </nav>
      )}

      <form onSubmit={handleSubmit}>
        {/* Card 1: General Details */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>General Details</h2>
          </div>

          {mode === "new" || mode === "edit" ? (
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                <label className={styles.label}>Category / Hashtag</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Gaming, Guides"
                  value={hashtag}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                <label className={styles.label}>Cover Image URL</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="https://... (Optional cover image URL)"
                  value={topImageUrl}
                  onChange={(e) => handleCoverImageChange(e.target.value)}
                />
                {topImageUrl && topImageUrl.trim() !== "" && (
                  <div className={styles.coverPreviewBox}>
                    {!coverImgError ? (
                      <Image
                        src={toCDN(topImageUrl.trim())}
                        alt="Cover preview"
                        width={320}
                        height={180}
                        sizes="280px"
                        className={styles.coverPreviewImage}
                        onError={() => setCoverImgError(true)}
                      />
                    ) : (
                      <div className={styles.coverPreviewFallback}>
                        <ImageIcon className="w-8 h-8 opacity-40 text-slate-400" />
                        <span className="text-xs text-slate-400 mt-1">Unable to load image preview</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Target Blog</label>
                <select
                  className={styles.select}
                  value={selectedBlogId}
                  onChange={(e) => handleTargetBlogChange(e.target.value)}
                  required
                >
                  {existingBlogs.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.content?.[0]?.heading || "Untitled"} ({b.content?.length || 0} sections)
                    </option>
                  ))}
                  {cachedActiveBlog &&
                    !existingBlogs.some((b) => String(b.id) === String(cachedActiveBlog.id)) && (
                      <option value={cachedActiveBlog.id}>
                        {cachedActiveBlog.content?.[0]?.heading || "Untitled"} (
                        {cachedActiveBlog.content?.length || 0} sections)
                      </option>
                    )}
                </select>
              </div>

              {selectedBlog && (
                <div className={styles.blogPreviewBox}>
                  <div className={styles.blogPreviewLeft}>
                    <div className={styles.blogPreviewThumbWrapper}>
                      <Image
                        src={toCDN(selectedBlog.top_image) || DUMMY_BLOG_IMAGE}
                        alt="Thumbnail"
                        fill
                        sizes="80px"
                        className={styles.blogPreviewThumb}
                      />
                    </div>
                    <h3 className={styles.blogPreviewTitle}>
                      {selectedBlog.content?.[0]?.heading || "Untitled Blog"}
                    </h3>
                    <div className={styles.blogPreviewBadges}>
                      <span
                        className={styles.previewBadgeCategory}
                        title={
                          (Array.isArray(selectedBlog.hashtags)
                            ? selectedBlog.hashtags[0]
                            : typeof selectedBlog.hashtags === "string"
                            ? selectedBlog.hashtags.split(",")[0]?.trim()
                            : "") || "General"
                        }
                      >
                        {(Array.isArray(selectedBlog.hashtags)
                          ? selectedBlog.hashtags[0]
                          : typeof selectedBlog.hashtags === "string"
                          ? selectedBlog.hashtags.split(",")[0]?.trim()
                          : "") || "General"}
                      </span>
                      <span className={styles.previewBadgeSections}>
                        {selectedBlog.content?.length || 0} existing sections
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/blogs/${selectedBlog.id}`}
                    target="_blank"
                    className={styles.previewViewLink}
                  >
                    <span>View Blog</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Content Sections */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              {mode === "new" ? "Content Sections" : "New Sections"}
            </h2>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={sections.map((s) => s._uid)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section, sIndex) => (
                <SortableSectionCard
                  key={section._uid}
                  section={section}
                  sIndex={sIndex}
                  mode={mode}
                  existingCount={selectedBlog?.content?.length || 0}
                  sectionsCount={sections.length}
                  onRemove={handleRemoveSection}
                  onChange={handleSectionChange}
                  styles={styles}
                />
              ))}
            </SortableContext>

            <DragOverlay adjustScale={false}>
              {activeSection ? (
                <div className={`${styles.sectionCard} ${styles.sectionCardOverlay}`}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={`${styles.dragHandle} ${styles.dragHandleGrabbing}`}>
                        <GripVertical size={16} />
                      </div>
                      <span className={styles.sectionTitle}>
                        <span className={styles.sectionIndex}>
                          Section{" "}
                          {mode === "existing"
                            ? (selectedBlog?.content?.length || 0) + 1 + activeIndex
                            : activeIndex + 1}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    {activeSection.heading || "Untitled Section"}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <button
            type="button"
            onClick={handleAddSection}
            className={styles.addSectionBtn}
          >
            <Plus size={15} />
            <span>
              {mode === "existing"
                ? `Add Section ${(selectedBlog?.content?.length || 0) + 1 + sections.length}`
                : "Add Section"}
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsBar}>
          <div className={styles.actionsBarLeft}>
            <div
              className={styles.globalHistoryToolbar}
              role="toolbar"
              aria-label="Blog global history controls (bottom)"
            >
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                className={`${styles.globalHistoryBtn} ${
                  !canUndo ? styles.globalHistoryBtnDisabled : ""
                }`}
                title="Undo blog changes (Ctrl+Z / Cmd+Z)"
                aria-label="Undo blog changes (Ctrl+Z / Cmd+Z)"
              >
                <Undo size={15} />
                <span className={styles.globalHistoryBtnLabel}>Undo</span>
              </button>
              <span className={styles.globalHistoryDivider} />
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className={`${styles.globalHistoryBtn} ${
                  !canRedo ? styles.globalHistoryBtnDisabled : ""
                }`}
                title="Redo blog changes (Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y)"
                aria-label="Redo blog changes (Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y)"
              >
                <Redo size={15} />
                <span className={styles.globalHistoryBtnLabel}>Redo</span>
              </button>
            </div>
          </div>

          <div className={styles.actionsBarRight}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelBtn}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              <Save size={15} />
              <span>
                {isSubmitting
                  ? "Saving..."
                  : mode === "new"
                  ? "Publish Blog"
                  : mode === "edit"
                  ? "Update Blog"
                  : "Append Section"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function PostBlogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Loading...</div>}>
      <PostBlogForm />
    </Suspense>
  );
}
