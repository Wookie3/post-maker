"use client";

import React from "react";
import { FacebookPostData, ReactionType } from "@/types";
import { formatNumber } from "@/lib/export";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  BadgeCheck,
  Globe,
  Users,
  Lock,
} from "lucide-react";

interface FacebookRendererProps {
  data: FacebookPostData;
  selectedField: string | null;
  onSelectField: (field: string) => void;
}

const reactionEmoji: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😡",
};

const PrivacyIcon = ({ privacy }: { privacy: string }) => {
  switch (privacy) {
    case "public":
      return <Globe size={12} />;
    case "friends":
      return <Users size={12} />;
    default:
      return <Lock size={12} />;
  }
};

export default function FacebookRenderer({
  data,
  selectedField,
  onSelectField,
}: FacebookRendererProps) {
  const themeClass =
    data.theme === "dark" ? "facebook-dark" : "facebook-light";

  const totalReactions = Object.values(data.reactions).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div
      className={`${themeClass}`}
      style={{
        fontFamily: "var(--fb-font)",
        backgroundColor: "var(--fb-bg)",
        color: "var(--fb-text)",
        width: "100%",
        maxWidth: "500px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div data-post-container className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2.5">
            {/* Avatar */}
            <div
              className={`editable-element ${selectedField === "profileImage" ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectField("profileImage");
              }}
            >
              <div
                className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                style={{ backgroundColor: "var(--fb-border)" }}
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

            {/* Name + timestamp + privacy */}
            <div className="flex flex-col">
              <div
                className={`editable-element flex items-center gap-1 ${selectedField === "displayName" ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectField("displayName");
                }}
              >
                <span className="font-semibold text-[14px] leading-5 hover:underline cursor-pointer">
                  {data.displayName}
                </span>
                {data.verified && (
                  <BadgeCheck
                    size={16}
                    fill="var(--fb-verified)"
                    stroke="var(--fb-verified)"
                    className="text-white"
                  />
                )}
              </div>
              <div
                className={`editable-element flex items-center gap-1 ${selectedField === "timestamp" ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectField("timestamp");
                }}
              >
                <span
                  className="text-[12px] leading-4"
                  style={{ color: "var(--fb-secondary)" }}
                >
                  {data.timestamp}
                </span>
                <span style={{ color: "var(--fb-secondary)" }}>·</span>
                <span style={{ color: "var(--fb-secondary)" }}>
                  <PrivacyIcon privacy={data.privacy} />
                </span>
              </div>
            </div>
          </div>

          <button className="p-2 rounded-full hover:bg-[var(--fb-hover)] transition-colors">
            <MoreHorizontal
              size={20}
              style={{ color: "var(--fb-secondary)" }}
            />
          </button>
        </div>

        {/* Post text */}
        {data.text && (
          <div
            className={`editable-element mb-3 ${selectedField === "text" ? "selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField("text");
            }}
          >
            <p className="text-[15px] leading-5 whitespace-pre-wrap break-words">
              {data.text}
            </p>
          </div>
        )}

        {/* Media */}
        {data.mediaImage && (
          <div
            className={`editable-element mb-3 -mx-4 ${selectedField === "mediaImage" ? "selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField("mediaImage");
            }}
          >
            <img
              src={data.mediaImage}
              alt="media"
              className="w-full object-cover"
              style={{ maxHeight: "400px" }}
            />
          </div>
        )}

        {/* Reactions + comments/shares counts */}
        <div
          className="flex items-center justify-between pb-2 mb-2"
          style={{ borderBottom: `1px solid var(--fb-border)` }}
        >
          {/* Reaction emoji stack */}
          <div
            className={`editable-element flex items-center gap-1 ${selectedField === "likes" ? "selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField("likes");
            }}
          >
            <div className="flex -space-x-1">
              {data.topReactions.map((r) => (
                <span
                  key={r}
                  className="inline-block w-[18px] h-[18px] text-[14px] leading-[18px] bg-[var(--fb-bg)] rounded-full text-center"
                >
                  {reactionEmoji[r]}
                </span>
              ))}
            </div>
            <span
              className="text-[13px] ml-1"
              style={{ color: "var(--fb-secondary)" }}
            >
              {formatNumber(totalReactions)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`editable-element ${selectedField === "comments" ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectField("comments");
              }}
            >
              <span
                className="text-[13px]"
                style={{ color: "var(--fb-secondary)" }}
              >
                {formatNumber(data.comments)} comments
              </span>
            </div>
            <div
              className={`editable-element ${selectedField === "shares" ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectField("shares");
              }}
            >
              <span
                className="text-[13px]"
                style={{ color: "var(--fb-secondary)" }}
              >
                {formatNumber(data.shares)} shares
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <button className="flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md hover:bg-[var(--fb-hover)] transition-colors">
            <ThumbsUp size={18} style={{ color: "var(--fb-secondary)" }} />
            <span
              className="font-semibold text-[13px]"
              style={{ color: "var(--fb-secondary)" }}
            >
              Like
            </span>
          </button>
          <button className="flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md hover:bg-[var(--fb-hover)] transition-colors">
            <MessageCircle
              size={18}
              style={{ color: "var(--fb-secondary)" }}
            />
            <span
              className="font-semibold text-[13px]"
              style={{ color: "var(--fb-secondary)" }}
            >
              Comment
            </span>
          </button>
          <button className="flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md hover:bg-[var(--fb-hover)] transition-colors">
            <Share2 size={18} style={{ color: "var(--fb-secondary)" }} />
            <span
              className="font-semibold text-[13px]"
              style={{ color: "var(--fb-secondary)" }}
            >
              Share
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
