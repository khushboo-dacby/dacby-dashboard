"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Plus, RotateCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import styles from "./styles/blogs.module.css";
import BlogCard from "./components/BlogCard";
import { getStoredBlogs } from "./data/mockBlogs";
import { getBlogs } from "./apis/api";

const fetchBlogs = async () => {
  try {
    const res = await getBlogs();
    if (res?.blogs && Array.isArray(res.blogs) && res.blogs.length > 0) {
      return res.blogs;
    }
  } catch (err) {
    console.warn("Failed to fetch live blogs from database, using fallback:", err);
  }
  return getStoredBlogs();
};

export default function BlogsPage() {
  const {
    data: blogs = [],
    isLoading,
    isValidating,
    mutate,
  } = useSWR("blogs-list", fetchBlogs, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shouldRefresh = sessionStorage.getItem("refresh_blogs");
      if (shouldRefresh === "true") {
        sessionStorage.removeItem("refresh_blogs");
        mutate();
      }
    }
  }, [mutate]);

  const handleRefresh = async () => {
    try {
      await mutate();
      toast.success("Blogs list refreshed");
    } catch {
      toast.error("Failed to refresh blogs");
    }
  };

  return (
    <div className={styles.container}>
      {/* Project Theme Banner matching Add Product / Inventory banner */}
      <div className={styles.banner}>
        <div>
          <h1 className={styles.bannerTitle}>Blogs & Articles</h1>
          <p className={styles.bannerSubtitle}>
            Browse gaming guides, console comparisons, and product insights from the Dacby team.
          </p>
        </div>

        <div className={styles.bannerActions}>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isValidating}
            className={styles.refreshButton}
            title="Refresh blogs list"
            aria-label="Refresh blogs list"
          >
            <RotateCw
              size={15}
              className={isValidating ? styles.spinIcon : ""}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/blogs/add?from=/blogs"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("blog_nav_source", "/blogs");
              }
            }}
            className={styles.postBlogButton}
          >
            <Plus size={16} strokeWidth={2.25} />
            <span>Post Blog</span>
          </Link>
        </div>
      </div>

      {/* Blog Cards Grid with Circular Loader */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loadingSpinner} />
          <span className={styles.loadingText}>Loading blogs...</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p className="text-slate-500 font-medium">No blogs found.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {blogs
            .filter((blog) => blog.visible !== false)
            .map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onDelete={(deletedId) => {
                  mutate(
                    (currentBlogs) =>
                      (currentBlogs || []).filter(
                        (b) => String(b.id) !== String(deletedId)
                      ),
                    false
                  );
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
}
