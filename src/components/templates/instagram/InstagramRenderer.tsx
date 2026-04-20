"use client";

import React from "react";
import { InstagramPostData } from "@/types";
import { formatNumber } from "@/lib/export";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
} from "lucide-react";

interface InstagramRendererProps {
  data: InstagramPostData;
  selectedField: string | null;
  onSelectField: (field: string) => void;
}

function Editable({
  field,
  selectedField,
  onSelect,
  children,
  className = "",
}: {
  field: string;
  selectedField: string | null;
  onSelect: (f: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Edit ${field}`}
      className={`editable-element ${selectedField === field ? "selected" : ""} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(field);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(field);
        }
      }}
    >
      {children}
    </div>
  );
}

export default function InstagramRenderer({
  data,
  selectedField,
  onSelectField,
}: InstagramRendererProps) {
  const themeClass =
    data.theme === "dark" ? "instagram-dark" : "instagram-light";
  return (
    <div
      className={`${themeClass}`}
      style={{
        fontFamily: "var(--ig-font)",
        backgroundColor: "var(--ig-bg)",
        color: "var(--ig-text)",
        width: "100%",
        maxWidth: "470px",
      }}
    >
      <div data-post-container>
        <div
          className="flex items-center justify-between px-3 py-2.5"
          style={{ borderBottom: `1px solid var(--ig-border)` }}
        >
          <div className="flex items-center gap-2.5">
            <Editable field="profileImage" selectedField={selectedField} onSelect={onSelectField}>
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                style={{ background: "var(--ig-border)" }}
              >
                {data.profileImage ? (
                  <img
                    src={data.profileImage}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ color: "var(--ig-secondary)" }}>
                    {data.displayName?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
            </Editable>

            <div className="flex flex-col">
              <Editable field="displayName" selectedField={selectedField} onSelect={onSelectField} className="flex items-center gap-1">
                <span className="font-semibold text-[13px] leading-4">
                  {data.displayName}
                </span>
                {data.verified && (
                  <BadgeCheck
                    size={12}
                    fill="var(--ig-verified)"
                    stroke="var(--ig-verified)"
                    className="text-white"
                  />
                )}
                {data.sponsored && (
                  <span className="text-[11px] text-[var(--ig-secondary)]">
                    · Sponsored
                  </span>
                )}
              </Editable>
              {data.location && (
                <Editable field="location" selectedField={selectedField} onSelect={onSelectField}>
                  <span className="text-[11px] leading-3">{data.location}</span>
                </Editable>
              )}
            </div>
          </div>

          <button aria-hidden="true" tabIndex={-1} className="p-1">
            <MoreHorizontal
              size={16}
              style={{ color: "var(--ig-text)" }}
            />
          </button>
        </div>

        <Editable field="mediaImage" selectedField={selectedField} onSelect={onSelectField}>
          <div
            className="w-full overflow-hidden"
            style={{
              backgroundColor: "var(--ig-border)",
              aspectRatio:
                data.imageAspectRatio === "4:5" ? "4/5" : "1/1",
            }}
          >
            {data.mediaImage ? (
              <img
                src={data.mediaImage}
                alt="post image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-[var(--ig-secondary)]">
                <svg
                  aria-hidden="true"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>
        </Editable>

        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-4">
            <button aria-hidden="true" tabIndex={-1} className="p-0.5">
              <Heart size={24} style={{ color: "var(--ig-text)" }} />
            </button>
            <button aria-hidden="true" tabIndex={-1} className="p-0.5">
              <MessageCircle
                size={24}
                style={{ color: "var(--ig-text)" }}
              />
            </button>
            <button aria-hidden="true" tabIndex={-1} className="p-0.5">
              <Send size={24} style={{ color: "var(--ig-text)" }} />
            </button>
          </div>
          <button aria-hidden="true" tabIndex={-1} className="p-0.5">
            <Bookmark size={24} style={{ color: "var(--ig-text)" }} />
          </button>
        </div>

        <Editable field="likes" selectedField={selectedField} onSelect={onSelectField} className="px-3 pb-1">
          <span className="font-semibold text-[13px]">
            {formatNumber(data.likes)} likes
          </span>
        </Editable>

        <Editable field="text" selectedField={selectedField} onSelect={onSelectField} className="px-3 pb-1">
          <p className="text-[13px] leading-4">
            <span className="font-semibold mr-1">{data.displayName}</span>
            <span>{data.text}</span>
          </p>
        </Editable>

        <Editable field="comments" selectedField={selectedField} onSelect={onSelectField} className="px-3 pb-1">
          <span
            className="text-[13px]"
            style={{ color: "var(--ig-secondary)" }}
          >
            View all {formatNumber(data.comments)} comments
          </span>
        </Editable>

        <Editable field="timestamp" selectedField={selectedField} onSelect={onSelectField} className="px-3 pb-4">
          <span
            className="text-[10px] uppercase tracking-wide"
            style={{ color: "var(--ig-secondary)" }}
          >
            {data.timestamp}
          </span>
        </Editable>
      </div>
    </div>
  );
}
