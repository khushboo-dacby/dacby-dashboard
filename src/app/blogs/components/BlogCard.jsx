"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Image as ImageIcon, Calendar } from "lucide-react";
import styles from "../styles/blogs.module.css";
import { formatBlogDate, DUMMY_BLOG_IMAGE } from "../data/mockBlogs";

export default function BlogCard({ blog }) {
  const [imgError, setImgError] = useState(false);

  if (!blog) return null;

  // Extract requested elements per specification:
  // 1. first document heading
  const firstDoc = blog.content && blog.content.length > 0 ? blog.content[0] : null;
  const firstHeading = firstDoc?.heading || "Untitled Article";
  const firstPara = firstDoc?.para || "";

  // 2. first hashtag
  const firstHashtag =
    blog.hashtags && blog.hashtags.length > 0 ? blog.hashtags[0] : "Article";

  // 3. top image (use dummy image in place of url for now)
  const topImage = DUMMY_BLOG_IMAGE;

  // 4. created date
  const formattedDate = formatBlogDate(blog.created_at);

  return (
    <Link href={`/blogs/${blog.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {topImage && !imgError ? (
          <img
            src={topImage}
            alt={firstHeading}
            className={styles.cardImage}
            onError={() => setImgError(true)}
            loading="lazy"
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
  );
}
