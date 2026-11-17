"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import styles from "../styles/blogs.module.css";
import { formatBlogDate, DUMMY_BLOG_IMAGE } from "../data/mockBlogs";
import { deleteBlog } from "../apis/api";
import { toCDN } from "../helper";
import DeleteBlogModal from "./DeleteBlogModal";

export default function BlogCard({ blog, onDelete }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [blog?.top_image, blog?.id]);

  if (!blog) return null;

  // Extract requested elements per specification:
  // 1. first document heading
  const firstDoc = blog.content && blog.content.length > 0 ? blog.content[0] : null;
  const firstHeading = firstDoc?.heading || "Untitled Article";
  const firstPara = firstDoc?.para || "";

  // 2. first hashtag
  const firstHashtag =
    blog.hashtags && blog.hashtags.length > 0 ? blog.hashtags[0] : "Article";

  // 3. top image (use real top_image if available, fallback to dummy)
  const rawTopImage =
    blog.top_image && blog.top_image.trim() !== ""
      ? blog.top_image.trim()
      : DUMMY_BLOG_IMAGE;
  const imageSrc = toCDN(rawTopImage) || DUMMY_BLOG_IMAGE;

  // Determine if domain needs unoptimized prop to prevent Next.js host errors
  const isUnoptimized = (() => {
    if (!imageSrc || imageSrc.startsWith("/")) return false;
    try {
      const url = new URL(imageSrc);
      return (
        url.hostname !== "dacby-database.web.app" &&
        url.hostname !== "firebasestorage.googleapis.com"
      );
    } catch {
      return true;
    }
  })();

  // 4. created date
  const formattedDate = formatBlogDate(blog.created_at);

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined" && blog) {
      try {
        sessionStorage.setItem("active_blog_data", JSON.stringify(blog));
        sessionStorage.setItem("blog_nav_source", "/blogs");
      } catch (err) {
        console.warn("Could not cache active blog in session:", err);
      }
    }
    router.push(`/blogs/add?edit=true&blogId=${blog.id}&from=/blogs`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await deleteBlog(blog.id);
      if (res?.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("refresh_blogs", "true");
        }
        toast.success(res.message || "Blog deleted successfully.");
        setShowDeleteModal(false);
        onDelete?.(blog.id);
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

  return (
    <>
      <Link href={`/blogs/${blog.id}`} className={styles.card}>
        <div className={styles.imageWrapper}>
          {/* Action Buttons: Edit and Delete */}
          <div className={styles.cardActions}>
            <button
              type="button"
              onClick={handleEdit}
              className={styles.actionButton}
              title="Edit blog"
              aria-label="Edit blog"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={`${styles.actionButton} ${styles.actionButtonDelete}`}
              title="Delete blog"
              aria-label="Delete blog"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {imageSrc && !imgError ? (
            <Image
              src={imageSrc}
              alt={firstHeading}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.cardImage}
              unoptimized={isUnoptimized}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.imageFallback}>
              <ImageIcon className="w-10 h-10 opacity-30" />
            </div>
          )}
        </div>

        <div className={styles.cardBody}>
          <span className={styles.badge}>{firstHashtag}</span>

          <h3 className={styles.cardHeading}>{firstHeading}</h3>

          {firstPara && <p className={styles.cardPara}>{firstPara}</p>}

          <div className={styles.cardFooter}>
            <span className={styles.date}>
              {formattedDate}
            </span>
            <span className={styles.readMore}>
              Read Article
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </Link>

      {/* Delete Confirmation Modal */}
      <DeleteBlogModal
        isOpen={showDeleteModal}
        blogTitle={firstHeading}
        isDeleting={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
