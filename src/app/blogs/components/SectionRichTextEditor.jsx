"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Check,
  X,
} from "lucide-react";
import styles from "../styles/tiptapEditor.module.css";

export default function SectionRichTextEditor({
  value = "",
  onChange,
  placeholder = "Write section content with rich text formatting and inline links...",
}) {
  const [showLinkBar, setShowLinkBar] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const linkInputRef = useRef(null);
  const lastEmittedValueRef = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: {
          depth: 100,
          newGroupDelay: 500,
        },
        link: {
          openOnClick: false,
          autolink: false,
          defaultProtocol: "https",
          HTMLAttributes: {
            rel: "noopener noreferrer nofollow",
            target: "_blank",
          },
        },
      }),
      Markdown,
    ],
    content: value || "",
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      handleKeyDown: (view, event) => {
        const isMod = event.metaKey || event.ctrlKey;
        if (isMod && (event.key.toLowerCase() === "z" || event.key.toLowerCase() === "y")) {
          // Allow page-level global capture handler to handle centralized Undo/Redo across entire blog
          return false;
        }
        return false;
      },
      handleDOMEvents: {
        copy: (view, event) => {
          const { state } = view;
          const { from, to, empty } = state.selection;
          if (empty) return false;

          const text = state.doc.textBetween(from, to, "\n\n");
          // Strip any markdown link syntax [anchor](url) -> anchor
          const cleanText = text
            .replace(/\[\s*\[([^\]]+)\]\([^)]+\)\s*\]\(([^)]+)\)/g, "$1")
            .replace(/\[+([^\]]+)\]+\([^)]+\)/g, "$1");

          if (event.clipboardData) {
            event.clipboardData.setData("text/plain", cleanText);
            event.preventDefault();
            return true;
          }
          return false;
        },
        cut: (view, event) => {
          const { state, dispatch } = view;
          const { from, to, empty } = state.selection;
          if (empty) return false;

          const text = state.doc.textBetween(from, to, "\n\n");
          const cleanText = text
            .replace(/\[\s*\[([^\]]+)\]\([^)]+\)\s*\]\(([^)]+)\)/g, "$1")
            .replace(/\[+([^\]]+)\]+\([^)]+\)/g, "$1");

          if (event.clipboardData) {
            event.clipboardData.setData("text/plain", cleanText);
            dispatch(state.tr.deleteSelection());
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
      transformPastedText: (text) => {
        if (!text) return text;
        // Unwrap and strip any pasted raw markdown links or nested links
        let prev = "";
        let curr = text;
        while (curr !== prev) {
          prev = curr;
          curr = curr.replace(/\[\s*\[([^\]]+)\]\([^)]+\)\s*\]\(([^)]+)\)/g, "$1");
        }
        return curr.replace(/\[+([^\]]+)\]+\([^)]+\)/g, "$1");
      },
    },
    onUpdate: ({ editor: ed }) => {
      const md = ed.getMarkdown();
      lastEmittedValueRef.current = md;
      if (onChange) {
        onChange(md);
      }
    },
  });

  // Synchronize ONLY when value changes externally (e.g., global undo/redo, initial blog load, switching blogs)
  // Prevents wiping undo/redo history during internal typing
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (value === lastEmittedValueRef.current) return;

    const currentMarkdown = editor.getMarkdown();
    if (value !== currentMarkdown) {
      lastEmittedValueRef.current = value;
      editor.commands.setContent(value || "", {
        contentType: "markdown",
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  // Subscribe to editor transactions & updates to keep undo / redo availability in React state
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const updateHistoryState = () => {
      try {
        setCanUndo(Boolean(editor.can().undo()));
        setCanRedo(Boolean(editor.can().redo()));
      } catch {
        setCanUndo(false);
        setCanRedo(false);
      }
    };

    updateHistoryState();
    editor.on("transaction", updateHistoryState);
    editor.on("update", updateHistoryState);
    editor.on("selectionUpdate", updateHistoryState);

    return () => {
      editor.off("transaction", updateHistoryState);
      editor.off("update", updateHistoryState);
      editor.off("selectionUpdate", updateHistoryState);
    };
  }, [editor]);

  // Focus link input when link bar opens
  useEffect(() => {
    if (showLinkBar && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkBar]);

  const handleOpenLinkBar = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setShowLinkBar(true);
  };

  const handleApplyLink = () => {
    if (!editor) return;
    const trimmed = linkUrl.trim();

    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setShowLinkBar(false);
      return;
    }

    // Preserve internal relative DACBY URLs (e.g. /buy/consoles, #hash)
    let finalUrl = trimmed;
    if (
      !finalUrl.startsWith("/") &&
      !finalUrl.startsWith("#") &&
      !/^https?:\/\//i.test(finalUrl)
    ) {
      finalUrl = `https://${finalUrl}`;
    }

    if (editor.state.selection.empty) {
      // If no text is selected, insert the link using the URL as anchor text
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: finalUrl,
          marks: [{ type: "link", attrs: { href: finalUrl } }],
        })
        .run();
    } else {
      // Set hyperlink on selected text
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: finalUrl })
        .run();
    }

    setShowLinkBar(false);
    setLinkUrl("");
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowLinkBar(false);
    setLinkUrl("");
  };

  const handleKeyDownLinkInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApplyLink();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowLinkBar(false);
    }
  };

  if (!editor) {
    return (
      <div className={styles.editorWrapper}>
        <div className="p-4 text-xs text-slate-400">Loading editor...</div>
      </div>
    );
  }

  const handleUndo = (e) => {
    e?.preventDefault?.();
    if (!editor) return;
    editor.chain().focus().undo().run();
  };

  const handleRedo = (e) => {
    e?.preventDefault?.();
    if (!editor) return;
    editor.chain().focus().redo().run();
  };

  const isLinkActive = editor.isActive("link");

  return (
    <div className={styles.editorWrapper}>
      {/* Compact Formatting Toolbar */}
      <div className={styles.toolbar} role="toolbar" aria-label="Rich text editor toolbar">
        {/* Headings */}
        <div className={styles.toolGroup}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${styles.toolBtn} ${
              editor.isActive("heading", { level: 2 }) ? styles.toolBtnActive : ""
            }`}
            title="Subheading (H2)"
            aria-label="Subheading (H2)"
          >
            <Heading2 size={15} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`${styles.toolBtn} ${
              editor.isActive("heading", { level: 3 }) ? styles.toolBtnActive : ""
            }`}
            title="Small Heading (H3)"
            aria-label="Small Heading (H3)"
          >
            <Heading3 size={15} />
          </button>
        </div>

        <span className={styles.divider} />

        {/* Inline Formatting */}
        <div className={styles.toolGroup}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${styles.toolBtn} ${
              editor.isActive("bold") ? styles.toolBtnActive : ""
            }`}
            title="Bold"
            aria-label="Bold"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${styles.toolBtn} ${
              editor.isActive("italic") ? styles.toolBtnActive : ""
            }`}
            title="Italic"
            aria-label="Italic"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${styles.toolBtn} ${
              editor.isActive("strike") ? styles.toolBtnActive : ""
            }`}
            title="Strikethrough"
            aria-label="Strikethrough"
          >
            <Strikethrough size={15} />
          </button>
        </div>

        <span className={styles.divider} />

        {/* Lists & Blockquote */}
        <div className={styles.toolGroup}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${styles.toolBtn} ${
              editor.isActive("bulletList") ? styles.toolBtnActive : ""
            }`}
            title="Bullet List"
            aria-label="Bullet List"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles.toolBtn} ${
              editor.isActive("orderedList") ? styles.toolBtnActive : ""
            }`}
            title="Numbered List"
            aria-label="Numbered List"
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${styles.toolBtn} ${
              editor.isActive("blockquote") ? styles.toolBtnActive : ""
            }`}
            title="Blockquote"
            aria-label="Blockquote"
          >
            <Quote size={15} />
          </button>
        </div>

        <span className={styles.divider} />

        {/* Hyperlinks */}
        <div className={styles.toolGroup}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenLinkBar}
            className={`${styles.toolBtn} ${isLinkActive ? styles.toolBtnActive : ""}`}
            title={isLinkActive ? "Edit link URL" : "Insert link"}
            aria-label={isLinkActive ? "Edit link URL" : "Insert link"}
          >
            <LinkIcon size={15} />
          </button>
          {isLinkActive && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleRemoveLink}
              className={styles.toolBtn}
              title="Remove link"
              aria-label="Remove link"
            >
              <Unlink size={15} />
            </button>
          )}
        </div>

        <span className={styles.divider} />

        {/* History: Undo & Redo */}
        <div className={styles.toolGroup}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleUndo}
            className={`${styles.toolBtn} ${!canUndo ? styles.toolBtnDisabled : ""}`}
            title="Undo (Ctrl+Z / Cmd+Z)"
            aria-label="Undo"
          >
            <Undo size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleRedo}
            className={`${styles.toolBtn} ${!canRedo ? styles.toolBtnDisabled : ""}`}
            title="Redo (Ctrl+Y / Cmd+Shift+Z)"
            aria-label="Redo"
          >
            <Redo size={14} />
          </button>
        </div>
      </div>

      {/* Inline Link Editing Bar */}
      {showLinkBar && (
        <div className={styles.linkBar}>
          <input
            ref={linkInputRef}
            type="text"
            className={styles.linkInput}
            placeholder="Destination URL (e.g. /buy/consoles/sony-ps5 or https://...)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleKeyDownLinkInput}
          />
          <button
            type="button"
            onClick={handleApplyLink}
            className={styles.linkApplyBtn}
            title="Apply link"
          >
            <Check size={14} />
            <span>Apply</span>
          </button>
          {isLinkActive && (
            <button
              type="button"
              onClick={handleRemoveLink}
              className={styles.linkUnlinkBtn}
              title="Remove link"
            >
              <Unlink size={13} />
              <span>Remove</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowLinkBar(false)}
            className={styles.linkCancelBtn}
            title="Cancel link editing"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Editable Content Stream */}
      <div className={styles.editorBody}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

