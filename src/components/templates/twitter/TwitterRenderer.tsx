"use client";

import React from "react";
import { TwitterPostData } from "@/types";
import { formatNumber } from "@/lib/export";
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Bookmark,
  Share,
  BadgeCheck,
  MoreHorizontal,
} from "lucide-react";

interface TwitterRendererProps {
  data: TwitterPostData;
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

export default function TwitterRenderer({
  data,
  selectedField,
  onSelectField,
}: TwitterRendererProps) {
  const themeClass = data.theme === "dark" ? "twitter-dark" : "twitter-light";
  return (
    <div
      className={`${themeClass}`}
      style={{
        fontFamily: "var(--tw-font)",
        backgroundColor: "var(--tw-bg)",
        color: "var(--tw-text)",
        borderRadius: "0",
        width: "100%",
        maxWidth: "598px",
      }}
    >
      <div data-post-container className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Editable field="profileImage" selectedField={selectedField} onSelect={onSelectField}>
              <div
                className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0"
                style={{ backgroundColor: "var(--tw-border)" }}
              >
                {data.profileImage ? (
                  <img
                    src={data.profileImage}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: "var(--tw-secondary)" }}>
                    {data.displayName?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
            </Editable>

            <div className="flex flex-col">
              <Editable field="displayName" selectedField={selectedField} onSelect={onSelectField} className="flex items-center gap-1">
                <span className="font-bold text-[15px] leading-5">
                  {data.displayName}
                </span>
                {data.verified && (
                  <BadgeCheck
                    size={18}
                    fill={
                      data.verifiedType === "gold"
                        ? "#ffb800"
                        : data.verifiedType === "business"
                          ? "#c4a029"
                          : "var(--tw-verified-blue)"
                    }
                    stroke={
                      data.verifiedType === "gold"
                        ? "#ffb800"
                        : data.verifiedType === "business"
                          ? "#c4a029"
                          : "var(--tw-verified-blue)"
                    }
                    className="text-white"
                  />
                )}
              </Editable>
              <Editable field="handle" selectedField={selectedField} onSelect={onSelectField}>
                <span
                  className="text-[15px] leading-5"
                  style={{ color: "var(--tw-secondary)" }}
                >
                  @{data.handle}
                </span>
              </Editable>
            </div>
          </div>

          <button aria-hidden="true" tabIndex={-1} className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors">
            <MoreHorizontal
              size={18}
              style={{ color: "var(--tw-secondary)" }}
            />
          </button>
        </div>

        <Editable field="text" selectedField={selectedField} onSelect={onSelectField} className="mb-3">
          <p
            className="text-[15px] leading-[20px] whitespace-pre-wrap break-words"
            style={{ color: "var(--tw-text)" }}
          >
            {data.text}
          </p>
        </Editable>

        {data.mediaImage && (
          <Editable field="mediaImage" selectedField={selectedField} onSelect={onSelectField} className="mb-3">
            <div
              className="rounded-2xl overflow-hidden border"
              style={{ borderColor: "var(--tw-border)" }}
            >
              <img
                src={data.mediaImage}
                alt="media"
                className="w-full object-cover"
                style={{ maxHeight: "285px" }}
              />
            </div>
          </Editable>
        )}

        {data.isQuoteTweet && data.quotedTweet && (
          <div
            className="mb-3 rounded-2xl border p-3 cursor-pointer"
            style={{ borderColor: "var(--tw-border)" }}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <span className="font-bold text-[13px]">
                {data.quotedTweet.displayName}
              </span>
              {data.quotedTweet.verified && (
                <BadgeCheck
                  size={14}
                  fill="var(--tw-verified-blue)"
                  stroke="var(--tw-verified-blue)"
                  className="text-white"
                />
              )}
              <span
                className="text-[13px]"
                style={{ color: "var(--tw-secondary)" }}
              >
                @{data.quotedTweet.handle}
              </span>
            </div>
            <p
              className="text-[13px] leading-[18px] whitespace-pre-wrap"
              style={{ color: "var(--tw-text)" }}
            >
              {data.quotedTweet.text}
            </p>
          </div>
        )}

        <Editable field="timestamp" selectedField={selectedField} onSelect={onSelectField} className="mb-3">
          <div
            className="flex items-center gap-1 text-[13px] pb-3"
            style={{
              color: "var(--tw-secondary)",
              borderBottom: `1px solid var(--tw-border)`,
            }}
          >
            <span>{data.timestamp}</span>
            <span>·</span>
            <span style={{ color: "var(--tw-accent)" }}>
              {formatNumber(data.views)}
            </span>
            <span>Views</span>
          </div>
        </Editable>

        <div
          className="flex items-center gap-5 text-[13px] pb-3"
          style={{
            color: "var(--tw-secondary)",
            borderBottom: `1px solid var(--tw-border)`,
          }}
        >
          <Editable field="retweets" selectedField={selectedField} onSelect={onSelectField} className="flex items-center gap-1">
            <span className="font-bold" style={{ color: "var(--tw-text)" }}>
              {formatNumber(data.retweets)}
            </span>
            <span>Reposts</span>
          </Editable>
          <Editable field="likes" selectedField={selectedField} onSelect={onSelectField} className="flex items-center gap-1">
            <span className="font-bold" style={{ color: "var(--tw-text)" }}>
              {formatNumber(data.likes)}
            </span>
            <span>Likes</span>
          </Editable>
          <Editable field="bookmarks" selectedField={selectedField} onSelect={onSelectField} className="flex items-center gap-1">
            <span className="font-bold" style={{ color: "var(--tw-text)" }}>
              {formatNumber(data.bookmarks)}
            </span>
            <span>Bookmarks</span>
          </Editable>
        </div>

        <div
          className="flex items-center justify-between pt-1"
          style={{ color: "var(--tw-secondary)" }}
        >
          <button aria-hidden="true" tabIndex={-1} className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
            <MessageCircle size={18} className="group-hover:text-sky-400" />
          </button>
          <button aria-hidden="true" tabIndex={-1} className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
            <Repeat2 size={18} className="group-hover:text-green-400" />
          </button>
          <button aria-hidden="true" tabIndex={-1} className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
            <Heart size={18} className="group-hover:text-pink-400" />
          </button>
          <button aria-hidden="true" tabIndex={-1} className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
            <BarChart3 size={18} className="group-hover:text-sky-400" />
          </button>
          <div className="flex items-center">
            <button aria-hidden="true" tabIndex={-1} className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
              <Bookmark size={18} className="group-hover:text-sky-400" />
            </button>
            <button aria-hidden="true" tabIndex={-1} className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
              <Share size={18} className="group-hover:text-sky-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
