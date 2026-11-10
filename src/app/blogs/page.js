"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import styles from "./styles/blogs.module.css";
import BlogCard from "./components/BlogCard";
import { getStoredBlogs } from "./data/mockBlogs";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBlogs(getStoredBlogs());
    setMounted(true);
  }, []);

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

        <Link href="/blogs/add" className={styles.postBlogButton}>
          <Plus size={16} strokeWidth={2.25} />
          <span>Post Blog</span>
        </Link>
      </div>

      {/* Blog Cards Grid */}
      <div className={styles.grid}>
        {blogs
          .filter((blog) => blog.visible !== false)
          .map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
      </div>
    </div>
  );
}
