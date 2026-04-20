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
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2.5">
            <Editable field="profileImage" selectedField={selectedField} onSelect={onSelectField}>
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
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: "var(--fb-secondary)" }}>
                    {data.displayName?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
            </Editable>

            <div className="flex flex-col">
              <Editable field="displayName" selectedField={selectedField} onSelect={onSelectField} className="flex items-center gap-1">
                <span className="font-semibold text-[14px] leading-5">
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
              </Editable>
              <Editable field="timestamp" selectedField={selectedField} onSelect={onSelectField} className="flex items-center gap-1">
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
              </Editable>
            </div>
          </div>

          <button aria-hidden="true" tabIndex={-1} className="p-2 rounded-full hover:bg-[var(--fb-hover)] transition-colors">
            <MoreHorizontal
              size={20}
              style={{ color: "var(--fb-secondary)" }}
            />
          </button>
        </div>

        {data.text && (
          <Editable field="text" selectedField={selectedField} onSelect={onSelectField} className="mb-3">
            <p className="text-[15px] leading-5 whitespace-pre-wrap break-words">
              {data.text}
            </p>
          </Editable>
        )}

        {data.mediaImage && (
          <Editable field="mediaImage" selectedField={selectedField} onSelect={onSelectField} className="mb-3 -mx-4">
            <img
              src={data.mediaImage}
              alt="media"
              className="w-full object-cover"
              style={{ maxHeight: "400px" }}
            />
          </Editable>
        )}

        <div
          className="flex items-center justify-between pb-2 mb-2"
          style={{ borderBottom: `1px solid var(--fb-border)` }}
        >
          <Editable field="likes" selectedField={selectedField} onSelect={onSelectField} className="flex items-center gap-1">
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
          </Editable>

          <div className="flex items-center gap-3">
            <Editable field="comments" selectedField={selectedField} onSelect={onSelectField}>
              <span
                className="text-[13px]"
                style={{ color: "var(--fb-secondary)" }}
              >
                {formatNumber(data.comments)} comments
              </span>
            </Editable>
            <Editable field="shares" selectedField={selectedField} onSelect={onSelectField}>
              <span
                className="text-[13px]"
                style={{ color: "var(--fb-secondary)" }}
              >
                {formatNumber(data.shares)} shares
              </span>
            </Editable>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button aria-hidden="true" tabIndex={-1} className="flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md hover:bg-[var(--fb-hover)] transition-colors">
            <ThumbsUp size={18} style={{ color: "var(--fb-secondary)" }} />
            <span
              className="font-semibold text-[13px]"
              style={{ color: "var(--fb-secondary)" }}
            >
              Like
            </span>
          </button>
          <button aria-hidden="true" tabIndex={-1} className="flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md hover:bg-[var(--fb-hover)] transition-colors">
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
          <button aria-hidden="true" tabIndex={-1} className="flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md hover:bg-[var(--fb-hover)] transition-colors">
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
