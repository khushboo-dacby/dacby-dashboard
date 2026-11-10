"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import styles from "../styles/addBlog.module.css";
import {
  getStoredBlogs,
  saveBlogLocally,
  appendContentToBlog,
  DUMMY_BLOG_IMAGE
} from "../data/mockBlogs";

function PostBlogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBlogId = searchParams?.get("blogId") || "";

  const [existingBlogs, setExistingBlogs] = useState([]);
  const [mode, setMode] = useState(preselectedBlogId ? "existing" : "new");
  const [selectedBlogId, setSelectedBlogId] = useState(preselectedBlogId);

  // General Blog Meta
  const [hashtag, setHashtag] = useState("");
  const [topImageUrl, setTopImageUrl] = useState("");

  // Content Sections
  const [sections, setSections] = useState([
    {
      heading: "",
      para: "",
      image: "",
      backlinks: []
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const list = getStoredBlogs();
    setExistingBlogs(list);
    if (preselectedBlogId && list.some((b) => String(b.id) === String(preselectedBlogId))) {
      setSelectedBlogId(preselectedBlogId);
      setMode("existing");
    } else if (list.length > 0 && !selectedBlogId) {
      setSelectedBlogId(list[0].id);
    }
  }, [preselectedBlogId]);

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        heading: "",
        para: "",
        image: "",
        backlinks: []
      }
    ]);
  };

  const handleRemoveSection = (index) => {
    if (sections.length <= 1) {
      toast.error("At least one section is required.");
      return;
    }
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index, field, value) => {
    setSections((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddBacklink = (sectionIndex) => {
    setSections((prev) => {
      const copy = [...prev];
      const section = { ...copy[sectionIndex] };
      section.backlinks = [...(section.backlinks || []), { anchor: "", url: "" }];
      copy[sectionIndex] = section;
      return copy;
    });
  };

  const handleRemoveBacklink = (sectionIndex, linkIndex) => {
    setSections((prev) => {
      const copy = [...prev];
      const section = { ...copy[sectionIndex] };
      section.backlinks = section.backlinks.filter((_, li) => li !== linkIndex);
      copy[sectionIndex] = section;
      return copy;
    });
  };

  const handleBacklinkChange = (sectionIndex, linkIndex, field, value) => {
    setSections((prev) => {
      const copy = [...prev];
      const section = { ...copy[sectionIndex] };
      const links = [...section.backlinks];
      links[linkIndex] = { ...links[linkIndex], [field]: value };
      section.backlinks = links;
      copy[sectionIndex] = section;
      return copy;
    });
  };

  const selectedBlog = existingBlogs.find(
    (b) => String(b.id) === String(selectedBlogId)
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedSections = sections.map((sec) => ({
      heading: sec.heading.trim(),
      para: sec.para.trim(),
      image: sec.image ? sec.image.trim() : "",
      backlinks: (sec.backlinks || [])
        .filter((b) => b.anchor && b.anchor.trim() !== "")
        .map((b) => ({
          anchor: b.anchor.trim(),
          url: b.url ? b.url.trim() : "#"
        }))
    }));

    if (cleanedSections.some((sec) => !sec.heading || !sec.para)) {
      toast.error("Please provide both heading and paragraph for all sections.");
      return;
    }

    setIsSubmitting(true);

    if (mode === "new") {
      const newBlog = {
        id: `blog_${Date.now()}`,
        content: cleanedSections,
        hashtags: hashtag.trim() ? [hashtag.trim()] : ["General"],
        top_image: topImageUrl.trim() || DUMMY_BLOG_IMAGE,
        visible: true,
        created_at: {
          _seconds: Math.floor(Date.now() / 1000),
          _nanoseconds: 0
        }
      };

      saveBlogLocally(newBlog);
      toast.success("Blog published successfully.");

      setTimeout(() => {
        router.push(`/blogs/${newBlog.id}`);
      }, 300);
    } else {
      if (!selectedBlogId) {
        toast.error("Please select a target blog.");
        setIsSubmitting(false);
        return;
      }

      appendContentToBlog(selectedBlogId, cleanedSections);
      toast.success("Section added to blog successfully.");

      setTimeout(() => {
        router.push(`/blogs/${selectedBlogId}`);
      }, 300);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top back navigation */}
      <Link href="/blogs" className={styles.backLink}>
        <ArrowLeft size={15} />
        <span>Back to blogs</span>
      </Link>

      {/* Header Banner */}
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>
          {mode === "new" ? "Create Blog Post" : "Add Section to Blog"}
        </h1>
        <p className={styles.bannerSubtitle}>
          {mode === "new"
            ? "Configure article details, sections, and links."
            : "Append new content sections to an existing article."}
        </p>
      </div>

      {/* Mode Switcher */}
      <nav className={styles.modeTabs} aria-label="Creation mode">
        <button
          type="button"
          onClick={() => setMode("new")}
          className={`${styles.modeTabButton} ${
            mode === "new" ? styles.modeTabActive : styles.modeTabInactive
          }`}
        >
          Create New Blog
        </button>
        <button
          type="button"
          onClick={() => setMode("existing")}
          className={`${styles.modeTabButton} ${
            mode === "existing" ? styles.modeTabActive : styles.modeTabInactive
          }`}
        >
          Add to Existing Blog
        </button>
      </nav>

      <form onSubmit={handleSubmit}>
        {/* Card 1: General Details */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>General Details</h2>
          </div>

          {mode === "new" ? (
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                <label className={styles.label}>Category / Hashtag</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Gaming, Guides"
                  value={hashtag}
                  onChange={(e) => setHashtag(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                <label className={styles.label}>Cover Image URL</label>
                <div className={styles.coverInputRow}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Optional image URL"
                    value={topImageUrl}
                    onChange={(e) => setTopImageUrl(e.target.value)}
                  />
                  <img
                    src={topImageUrl.trim() || DUMMY_BLOG_IMAGE}
                    alt="Cover preview"
                    className={styles.coverThumbnail}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Target Blog</label>
                <select
                  className={styles.select}
                  value={selectedBlogId}
                  onChange={(e) => setSelectedBlogId(e.target.value)}
                  required
                >
                  {existingBlogs.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.content?.[0]?.heading || "Untitled"} ({b.content?.length || 0} sections)
                    </option>
                  ))}
                </select>
              </div>

              {selectedBlog && (
                <div className={styles.blogPreviewBox}>
                  <div className={styles.blogPreviewLeft}>
                    <img
                      src={selectedBlog.top_image || DUMMY_BLOG_IMAGE}
                      alt="Thumbnail"
                      className={styles.blogPreviewThumb}
                    />
                    <div className={styles.blogPreviewInfo}>
                      <h3 className={styles.blogPreviewTitle}>
                        {selectedBlog.content?.[0]?.heading || "Untitled Blog"}
                      </h3>
                      <div className={styles.blogPreviewBadges}>
                        <span className={styles.previewBadgeCategory}>
                          {selectedBlog.hashtags?.[0] || "General"}
                        </span>
                        <span className={styles.previewBadgeSections}>
                          {selectedBlog.content?.length || 0} existing sections
                        </span>
                      </div>
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

          {sections.map((section, sIndex) => {
            const isMain = mode === "new" && sIndex === 0;
            const existingCount = selectedBlog?.content?.length || 0;
            const sectionNumber =
              mode === "existing" ? existingCount + 1 + sIndex : sIndex + 1;

            return (
              <div
                key={sIndex}
                className={`${styles.sectionCard} ${
                  isMain ? styles.sectionCardMain : ""
                }`}
              >
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>
                    <span className={styles.sectionIndex}>
                      Section {sectionNumber}
                    </span>
                    {isMain && (
                      <span className="text-xs font-medium text-slate-500">
                        (Main Section)
                      </span>
                    )}
                  </span>

                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sIndex)}
                      className={styles.removeBtn}
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Heading</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter section heading"
                    value={section.heading}
                    onChange={(e) =>
                      handleSectionChange(sIndex, "heading", e.target.value)
                    }
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Paragraph</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Enter section content"
                    value={section.para}
                    onChange={(e) =>
                      handleSectionChange(sIndex, "para", e.target.value)
                    }
                    required
                  />
                </div>

                <div className={styles.fieldGroup} style={{ marginBottom: "0.75rem" }}>
                  <label className={styles.label}>Image URL (optional)</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://..."
                    value={section.image}
                    onChange={(e) =>
                      handleSectionChange(sIndex, "image", e.target.value)
                    }
                  />
                  {section.image && section.image.trim() !== "" && (
                    <div className={styles.sectionImagePreviewBox}>
                      <img
                        src={section.image.trim()}
                        alt={`Section ${sIndex + 1} preview`}
                        className={styles.sectionImagePreview}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Backlinks */}
                <div className={styles.backlinksBox}>
                  <div className={styles.backlinksHeader}>
                    <span className={styles.backlinksLabel}>
                      <LinkIcon size={12} className="inline mr-1" />
                      Backlinks
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddBacklink(sIndex)}
                      className={styles.addBacklinkBtn}
                    >
                      <Plus size={13} />
                      <span>Add Link</span>
                    </button>
                  </div>

                  {(section.backlinks || []).map((link, lIndex) => (
                    <div key={lIndex} className={styles.backlinkRow}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Anchor text"
                        value={link.anchor}
                        onChange={(e) =>
                          handleBacklinkChange(
                            sIndex,
                            lIndex,
                            "anchor",
                            e.target.value
                          )
                        }
                        required
                      />

                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Destination URL"
                        value={link.url}
                        onChange={(e) =>
                          handleBacklinkChange(
                            sIndex,
                            lIndex,
                            "url",
                            e.target.value
                          )
                        }
                        required
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveBacklink(sIndex, lIndex)}
                        className={styles.removeLinkBtn}
                        title="Remove link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

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
          <Link href="/blogs" className={styles.discardBtn}>
            Discard
          </Link>

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
                : "Save Changes"}
            </span>
          </button>
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
