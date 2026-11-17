"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Pencil, Trash2, Image as ImageIcon, RotateCw } from "lucide-react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import styles from "./styles/blogDetail.module.css";
import InlineBacklinksText from "../components/InlineBacklinksText";
import { getStoredBlogs, formatBlogDate } from "../data/mockBlogs";
import { getBlogById, deleteBlog } from "../apis/api";
import { toCDN } from "../helper";
import DeleteBlogModal from "../components/DeleteBlogModal";
import BlogDetailSkeleton from "../components/BlogDetailSkeleton";

const fetchBlogDetail = async (blogId) => {
  if (!blogId) return null;
  try {
    const liveBlog = await getBlogById(blogId);
    if (liveBlog) return liveBlog;
  } catch (err) {
    console.warn("Failed to fetch live blog detail, using fallback:", err);
  }
  const allBlogs = getStoredBlogs();
  const matched = allBlogs.find((b) => String(b.id) === String(blogId));
  return matched || null;
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const {
    data: blog,
    isLoading,
    isValidating,
    mutate: mutateBlog,
  } = useSWR(id ? `blog-detail:${id}` : null, () => fetchBlogDetail(id), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    fallbackData: (() => {
      if (typeof window !== "undefined") {
        try {
          const stored = sessionStorage.getItem("active_blog_data");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && String(parsed.id) === String(id)) return parsed;
          }
        } catch {}
      }
      return undefined;
    })(),
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topImgError, setTopImgError] = useState(false);

  useEffect(() => {
    setTopImgError(false);
  }, [id, blog?.top_image]);

  // If an edit or section was submitted, refresh blog detail from server
  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const shouldRefresh = sessionStorage.getItem(`refresh_blog_${id}`);
      if (shouldRefresh === "true") {
        sessionStorage.removeItem(`refresh_blog_${id}`);
        mutateBlog();
      }
    }
  }, [id, mutateBlog]);

  useEffect(() => {
    if (blog && typeof window !== "undefined") {
      try {
        sessionStorage.setItem("active_blog_data", JSON.stringify(blog));
      } catch (err) {}
    }
  }, [blog]);

  const handleSaveActiveBlog = () => {
    if (blog && typeof window !== "undefined") {
      try {
        sessionStorage.setItem("active_blog_data", JSON.stringify(blog));
        sessionStorage.setItem("blog_nav_source", `/blogs/${blog.id}`);
      } catch (err) {}
    }
  };

  const handleRefresh = async () => {
    try {
      await mutateBlog();
      toast.success("Blog details refreshed");
    } catch {
      toast.error("Failed to refresh blog details");
    }
  };

  const handleDeleteClick = () => {
    if (!blog?.id || isDeleting) return;
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!blog?.id || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await deleteBlog(blog.id);
      if (res?.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("refresh_blogs", "true");
        }
        mutate(
          "blogs-list",
          (current) =>
            (current || []).filter((b) => String(b.id) !== String(blog.id)),
          false
        );
        toast.success(res.message || "Blog deleted successfully.");
        setShowDeleteModal(false);
        router.push("/blogs");
      } else {
        toast.error(res?.message || "Failed to delete blog.");
      }
    } catch (err) {
      toast.error(err?.message || "Error deleting blog.");
      console.error("Delete blog error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && !blog) {
    return <BlogDetailSkeleton styles={styles} />;
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

        <div className={styles.topActions}>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isValidating}
            className={styles.backButton}
            style={{ color: "#475569", borderColor: "#cbd5e1" }}
            title="Refresh blog details"
            aria-label="Refresh blog details"
          >
            <RotateCw size={15} className={isValidating ? styles.spinIcon : ""} />
            <span className={styles.actionBtnLabel}>Refresh</span>
          </button>
          <Link
            href={`/blogs/add?edit=true&blogId=${blog.id}&from=${encodeURIComponent(`/blogs/${blog.id}`)}`}
            onClick={handleSaveActiveBlog}
            className={styles.backButton}
            style={{ color: "#2563eb", borderColor: "#bfdbfe" }}
            title="Edit this blog"
            aria-label="Edit this blog"
          >
            <Pencil size={15} />
            <span className={styles.actionBtnLabel}>Edit</span>
          </Link>
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className={styles.backButton}
            style={{ color: "#e11d48", borderColor: "#fecdd3" }}
            title="Delete this blog"
            aria-label="Delete this blog"
          >
            <Trash2 size={15} />
            <span className={styles.actionBtnLabel}>Delete</span>
          </button>
          <Link
            href={`/blogs/add?blogId=${blog.id}&from=${encodeURIComponent(`/blogs/${blog.id}`)}`}
            onClick={handleSaveActiveBlog}
            className={styles.backButton}
            style={{ color: "#475569", borderColor: "#cbd5e1" }}
            title="Add a new section to this blog"
            aria-label="Add a new section to this blog"
          >
            <Plus size={16} />
            <span className={styles.actionBtnLabel}>Add Section</span>
          </Link>
          <Link
            href="/blogs"
            className={styles.backButton}
            title="All Blogs"
            aria-label="All Blogs"
          >
            <ArrowLeft size={16} />
            <span className={styles.actionBtnLabel}>All Blogs</span>
          </Link>
        </div>
      </div>

      {/* Main Content Card Container */}
      <article className={styles.articleCard}>
        {/* Top Banner / Image - only shown if really available, falls back to blank dummy image on error */}
        {blog.top_image && blog.top_image.trim() !== "" && (
          // <div className={styles.topImageWrapper}>
          //   {!topImgError ? (
              
          //     <Image
          //       src={toCDN(blog.top_image.trim())}
          //       alt={mainTitle}
          //       width={1200}
          //       height={800}
          //       priority
          //       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          //       className={styles.topImage}
          //       style={{ width: "100%", height: "auto", objectFit: "contain" }}
          //       onError={() => setTopImgError(true)}
          //     />
          //   ) : (
          //     <div className={styles.imageFallback}>
          //       <ImageIcon className="w-16 h-16 opacity-30" />
          //     </div>
          //   )}
          // </div>

<div className={styles.topImageWrapper}>
  {!topImgError ? (
    <Image
      src={toCDN(blog.top_image.trim())}
      alt={mainTitle}
      width={1200}
      height={800}
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
      className={styles.topImage}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
      onError={() => setTopImgError(true)}
    />
  ) : (
    <div className={styles.imageFallback}>
      <ImageIcon className="w-16 h-16 opacity-30" />
    </div>
  )}
</div>
        )}

        {/* Category Tag & Date Meta Row */}
        <div className={styles.metaRow}>
          <span className={styles.categoryBadge}>{firstHashtag}</span>
          <span className={styles.createdDate}>{formattedDate}</span>
        </div>

        {/* Main Title */}
        <h1 className={styles.mainTitle}>{mainTitle}</h1>

        {/* <hr className={styles.divider} /> */}

        {/* Content Stream */}
        {contentList.map((doc, idx) => (
          <section key={idx} className={styles.section}>
            {/* Section heading: section 0 is the main title above, subsequent sections render their heading */}
            {idx > 0 && doc.heading && (
              <h2 className={styles.sectionHeading}>{doc.heading}</h2>
            )}

            {/* Section content with rich text formatting and inline links */}
            {doc.para && (
              <div className={styles.sectionPara}>
                <InlineBacklinksText para={doc.para} backlinks={doc.backlinks || []} />
              </div>
            )}

            {/* Section image - only shown if really available */}
            {doc.image && doc.image.trim() !== "" && (
              <div className={styles.sectionImageWrapper}>
               
                 <Image
    src={toCDN(doc.image.trim())}
    alt={doc.heading || `Section ${idx + 1}`}
    width={1200}
    height={800}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
    className={styles.sectionImage}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
    onError={(e) => {
      if (e.currentTarget?.parentElement) {
        e.currentTarget.parentElement.style.display = "none";
      }
    }}
  />
              </div>
            )}
          </section>
        ))}
      </article>

      {/* Delete Confirmation Modal */}
      <DeleteBlogModal
        isOpen={showDeleteModal}
        blogTitle={mainTitle}
        isDeleting={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
