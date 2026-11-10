"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import styles from "./styles/blogDetail.module.css";
import InlineBacklinksText from "../components/InlineBacklinksText";
import { getStoredBlogs, formatBlogDate, DUMMY_BLOG_IMAGE } from "../data/mockBlogs";

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const allBlogs = getStoredBlogs();
      const matched = allBlogs.find((b) => String(b.id) === String(id));
      setBlog(matched || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.notFoundCard}>
          <p className="text-slate-500 font-medium">Loading article details...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.notFoundCard}>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Blog Not Found</h2>
          <p className="text-slate-500 mb-6 text-sm">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link href="/blogs" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Back to all blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  const contentList = Array.isArray(blog.content) ? blog.content : [];
  const firstDoc = contentList[0] || {};
  const mainTitle = firstDoc.heading || "Blog Details";
  const firstHashtag =
    blog.hashtags && blog.hashtags.length > 0 ? blog.hashtags[0] : "Article";
  const formattedDate = formatBlogDate(blog.created_at);

  return (
    <div className={styles.pageWrapper}>
      {/* Top Bar with Breadcrumbs & Back Button */}
      <div className={styles.topBar}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <Link href="/blogs" className={styles.breadcrumbLink}>
            Blogs
          </Link>
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <span className={styles.breadcrumbCurrent} title={mainTitle}>
            {mainTitle}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={`/blogs/add?blogId=${blog.id}`}
            className={styles.backButton}
            style={{ color: "#2563eb", borderColor: "#bfdbfe" }}
          >
            <Plus size={16} />
            <span>Add Section</span>
          </Link>
          <Link href="/blogs" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>All Blogs</span>
          </Link>
        </div>
      </div>

      {/* Main Content Card Container */}
      <article className={styles.articleCard}>
        {/* Top Banner / Image */}
        <div className={styles.topImageWrapper}>
          <img
            src={DUMMY_BLOG_IMAGE}
            alt={mainTitle}
            className={styles.topImage}
            loading="eager"
          />
        </div>

        {/* Category Tag & Date Meta Row */}
        <div className={styles.metaRow}>
          <span className={styles.categoryBadge}>{firstHashtag}</span>
          <span className={styles.createdDate}>{formattedDate}</span>
        </div>

        {/* Main Title */}
        <h1 className={styles.mainTitle}>{mainTitle}</h1>

        <hr className={styles.divider} />

        {/* Content Stream */}
        {contentList.map((doc, idx) => (
          <section key={idx} className={styles.section}>
            {/* Section heading: section 0 is the main title above, subsequent sections render their heading */}
            {idx > 0 && doc.heading && (
              <h2 className={styles.sectionHeading}>{doc.heading}</h2>
            )}

            {/* Section paragraph with inline interactive backlinks */}
            {doc.para && (
              <p className={styles.sectionPara}>
                <InlineBacklinksText para={doc.para} backlinks={doc.backlinks || []} />
              </p>
            )}

            {/* Section image: uses doc.image or falls back to cover dummy image */}
            {(() => {
              const sectionImg =
                doc.image && doc.image.trim() !== ""
                  ? doc.image
                  : idx > 0
                  ? DUMMY_BLOG_IMAGE
                  : null;

              if (!sectionImg) return null;

              return (
                <div className={styles.sectionImageWrapper}>
                  <img
                    src={sectionImg}
                    alt={doc.heading || `Section ${idx + 1}`}
                    className={styles.sectionImage}
                    loading="lazy"
                  />
                </div>
              );
            })()}
          </section>
        ))}
      </article>
    </div>
  );
}
