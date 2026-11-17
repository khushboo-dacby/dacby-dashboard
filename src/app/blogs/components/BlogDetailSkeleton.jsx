import React from "react";
import defaultStyles from "../[id]/styles/blogDetail.module.css";

export default function BlogDetailSkeleton({ styles = defaultStyles }) {
  return (
    <div className={styles.pageWrapper}>
      {/* Top Bar Skeleton */}
      <div className={styles.topBar}>
        <div className={styles.skeletonBreadcrumbs}>
          <div
            className={`${styles.shimmerBase} ${styles.skeletonBreadcrumbItem}`}
            style={{ width: 70 }}
          />
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <div
            className={`${styles.shimmerBase} ${styles.skeletonBreadcrumbItem}`}
            style={{ width: 45 }}
          />
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <div
            className={`${styles.shimmerBase} ${styles.skeletonBreadcrumbItem}`}
            style={{ width: 190 }}
          />
        </div>

        <div className={styles.skeletonActions}>
          <div
            className={`${styles.shimmerBase} ${styles.skeletonButton} ${styles.skeletonButtonEdit}`}
          />
          <div
            className={`${styles.shimmerBase} ${styles.skeletonButton} ${styles.skeletonButtonDelete}`}
          />
          <div
            className={`${styles.shimmerBase} ${styles.skeletonButton} ${styles.skeletonButtonAdd}`}
          />
          <div
            className={`${styles.shimmerBase} ${styles.skeletonButton} ${styles.skeletonButtonAll}`}
          />
        </div>
      </div>

      {/* Main Content Card Skeleton */}
      <article className={styles.articleCard}>
        {/* Top Cover Image Skeleton */}
        <div className={`${styles.shimmerBase} ${styles.skeletonTopImage}`} />

        {/* Category Badge & Date Row */}
        <div className={styles.metaRow}>
          <div className={`${styles.shimmerBase} ${styles.skeletonBadge}`} />
          <div className={`${styles.shimmerBase} ${styles.skeletonDate}`} />
        </div>

        {/* Title Lines */}
        <div className={styles.skeletonTitleGroup}>
          <div
            className={`${styles.shimmerBase} ${styles.skeletonTitleLine}`}
            style={{ width: "80%" }}
          />
          <div
            className={`${styles.shimmerBase} ${styles.skeletonTitleLine}`}
            style={{ width: "55%" }}
          />
        </div>

        <hr className={styles.divider} />

        {/* Content Section 1 (Intro Paragraph) */}
        <div className={styles.skeletonTextGroup}>
          <div
            className={`${styles.shimmerBase} ${styles.skeletonLine}`}
            style={{ width: "100%" }}
          />
          <div
            className={`${styles.shimmerBase} ${styles.skeletonLine}`}
            style={{ width: "98%" }}
          />
          <div
            className={`${styles.shimmerBase} ${styles.skeletonLine}`}
            style={{ width: "94%" }}
          />
          <div
            className={`${styles.shimmerBase} ${styles.skeletonLine}`}
            style={{ width: "65%" }}
          />
        </div>

        {/* Content Section 2 (Heading, Paragraph, Section Image) */}
        <div className={styles.skeletonSectionGroup}>
          <div
            className={`${styles.shimmerBase} ${styles.skeletonSectionHeading}`}
            style={{ width: "32%" }}
          />

          <div className={styles.skeletonTextGroup}>
            <div
              className={`${styles.shimmerBase} ${styles.skeletonLine}`}
              style={{ width: "100%" }}
            />
            <div
              className={`${styles.shimmerBase} ${styles.skeletonLine}`}
              style={{ width: "96%" }}
            />
            <div
              className={`${styles.shimmerBase} ${styles.skeletonLine}`}
              style={{ width: "90%" }}
            />
            <div
              className={`${styles.shimmerBase} ${styles.skeletonLine}`}
              style={{ width: "52%" }}
            />
          </div>

          <div
            className={`${styles.shimmerBase} ${styles.skeletonSectionImage}`}
          />
        </div>
      </article>
    </div>
  );
}

