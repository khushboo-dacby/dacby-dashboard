"use client";

import React from "react";
import Image from "next/image";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SectionRichTextEditor from "./SectionRichTextEditor";
import { toCDN } from "../helper";

export default function SortableSectionCard({
  section,
  sIndex,
  mode,
  existingCount,
  sectionsCount,
  onRemove,
  onChange,
  styles,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isMain = mode === "new" && sIndex === 0;
  const sectionNumber =
    mode === "existing" ? existingCount + 1 + sIndex : sIndex + 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.sectionCard} ${
        isMain ? styles.sectionCardMain : ""
      } ${isDragging ? styles.sectionCardDragging : ""}`}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLeft}>
          <button
            type="button"
            className={`${styles.dragHandle} ${
              isDragging ? styles.dragHandleGrabbing : ""
            }`}
            {...attributes}
            {...listeners}
            title="Drag to reorder section"
            aria-label={`Drag to reorder Section ${sectionNumber}`}
          >
            <GripVertical size={16} />
          </button>

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
        </div>

        {sectionsCount > 1 && (
          <button
            type="button"
            onClick={() => onRemove(sIndex)}
            className={styles.removeBtn}
            title="Remove section"
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
          onChange={(e) => onChange(sIndex, "heading", e.target.value)}
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Paragraph Content</label>
        <SectionRichTextEditor
          key={section._uid}
          value={section.para}
          onChange={(markdown) => onChange(sIndex, "para", markdown)}
          placeholder="Enter section content with rich text formatting and inline links..."
        />
      </div>

      <div className={styles.fieldGroup} style={{ marginBottom: "0.25rem" }}>
        <label className={styles.label}>Image URL (optional)</label>
        <input
          type="text"
          className={styles.input}
          placeholder="https://..."
          value={section.image}
          onChange={(e) => onChange(sIndex, "image", e.target.value)}
        />
        {section.image && section.image.trim() !== "" && (
          <div className={styles.sectionImagePreviewBox}>
            <Image
              src={toCDN(section.image.trim())}
              alt={`Section ${sectionNumber} preview`}
              width={280}
              height={170}
              sizes="280px"
              className={styles.sectionImagePreview}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "170px",
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

