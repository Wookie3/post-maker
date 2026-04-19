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
      {/* Post container with data attribute for export */}
      <div data-post-container className="p-4">
        {/* Header row: avatar + name/handle + 3-dot menu */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`editable-element ${selectedField === "profileImage" ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectField("profileImage");
              }}
            >
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
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                    {data.displayName?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
            </div>

            {/* Name + Handle */}
            <div className="flex flex-col">
              <div
                className={`editable-element flex items-center gap-1 ${selectedField === "displayName" ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectField("displayName");
                }}
              >
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
              </div>
              <div
                className={`editable-element ${selectedField === "handle" ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectField("handle");
                }}
              >
                <span
                  className="text-[15px] leading-5"
                  style={{ color: "var(--tw-secondary)" }}
                >
                  @{data.handle}
                </span>
              </div>
            </div>
          </div>

          {/* 3-dot menu */}
          <button className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors">
            <MoreHorizontal
              size={18}
              style={{ color: "var(--tw-secondary)" }}
            />
          </button>
        </div>

        {/* Tweet text */}
        <div
          className={`editable-element mb-3 ${selectedField === "text" ? "selected" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectField("text");
          }}
        >
          <p
            className="text-[15px] leading-[20px] whitespace-pre-wrap break-words"
            style={{ color: "var(--tw-text)" }}
          >
            {data.text}
          </p>
        </div>

        {/* Media */}
        {data.mediaImage && (
          <div
            className={`editable-element mb-3 ${selectedField === "mediaImage" ? "selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField("mediaImage");
            }}
          >
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
          </div>
        )}

        {/* Quote Tweet */}
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

        {/* Timestamp */}
        <div
          className={`editable-element mb-3 ${selectedField === "timestamp" ? "selected" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectField("timestamp");
          }}
        >
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
        </div>

        {/* Engagement counts */}
        <div
          className="flex items-center gap-5 text-[13px] pb-3"
          style={{
            color: "var(--tw-secondary)",
            borderBottom: `1px solid var(--tw-border)`,
          }}
        >
          <div
            className={`editable-element flex items-center gap-1 ${selectedField === "retweets" ? "selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField("retweets");
            }}
          >
            <span className="font-bold" style={{ color: "var(--tw-text)" }}>
              {formatNumber(data.retweets)}
            </span>
            <span>Reposts</span>
          </div>
          <div
            className={`editable-element flex items-center gap-1 ${selectedField === "likes" ? "selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField("likes");
            }}
          >
            <span className="font-bold" style={{ color: "var(--tw-text)" }}>
              {formatNumber(data.likes)}
            </span>
            <span>Likes</span>
          </div>
          <div
            className={`editable-element flex items-center gap-1 ${selectedField === "bookmarks" ? "selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField("bookmarks");
            }}
          >
            <span className="font-bold" style={{ color: "var(--tw-text)" }}>
              {formatNumber(data.bookmarks)}
            </span>
            <span>Bookmarks</span>
          </div>
        </div>

        {/* Action bar */}
        <div
          className="flex items-center justify-between pt-1"
          style={{ color: "var(--tw-secondary)" }}
        >
          <button className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
            <MessageCircle size={18} className="group-hover:text-sky-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
            <Repeat2 size={18} className="group-hover:text-green-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
            <Heart size={18} className="group-hover:text-pink-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
            <BarChart3 size={18} className="group-hover:text-sky-400" />
          </button>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
              <Bookmark size={18} className="group-hover:text-sky-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-[var(--tw-hover)] transition-colors group">
              <Share size={18} className="group-hover:text-sky-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
