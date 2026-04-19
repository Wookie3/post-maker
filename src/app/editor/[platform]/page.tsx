"use client";

import React, { useEffect, useRef, useState, useCallback, useId } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useEditorStore,
  getDefaultPost,
} from "@/stores/editor";
import { Platform, PostData, TwitterPostData, InstagramPostData, FacebookPostData } from "@/types";
import { exportPost, downloadBlob, copyToClipboard, ExportFormat } from "@/lib/export";
import TwitterRenderer from "@/components/templates/twitter/TwitterRenderer";
import InstagramRenderer from "@/components/templates/instagram/InstagramRenderer";
import FacebookRenderer from "@/components/templates/facebook/FacebookRenderer";
import {
  ArrowLeft,
  Sun,
  Moon,
  Wand2,
  Download,
  Copy,
  RotateCcw,
  ImageIcon,
  Type,
  Hash,
  Clock,
  CheckCircle2,
  Settings,
  Share2,
  Eye,
  Bookmark,
  MessageSquare,
  Heart,
  MapPin,
  Shield,
} from "lucide-react";

// ─── Image upload helper ──────────────────────────────────────

function uploadImage(
  callback: (dataUrl: string) => void
): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.setAttribute("aria-label", "Upload image");
  input.style.position = "fixed";
  input.style.opacity = "0";
  input.style.pointerEvents = "none";
  document.body.appendChild(input);
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
    document.body.removeChild(input);
  };
  input.click();
}

// ─── Field editor components ──────────────────────────────────

function FieldGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const id = useId();
  const child = React.Children.only(children) as React.ReactElement<{
    id?: string;
  }>;
  return (
    <div className="mb-4">
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] mb-1.5">
        <Icon size={12} />
        {label}
      </label>
      {React.cloneElement(child, { id })}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  id?: string;
}) {
  const baseClasses =
    "w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-colors";
  if (multiline) {
    return (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`${baseClasses} resize-none`}
      />
    );
  }
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={baseClasses}
    />
  );
}

function NumberInput({
  value,
  onChange,
  id,
}: {
  value: number;
  onChange: (v: number) => void;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-colors"
        min={0}
      />
    </div>
  );
}

function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm ${
        value
          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
          : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          value ? "border-indigo-500" : "border-[var(--border)]"
        }`}
      >
        {value && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
      </div>
      {label}
    </button>
  );
}

function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => uploadImage(onChange)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--muted)] hover:border-indigo-500/30 hover:text-[var(--foreground)] transition-colors"
        >
          <ImageIcon size={14} />
          Upload
        </button>
        {value && (
          <div className="w-8 h-8 rounded-md overflow-hidden border border-[var(--border)]">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      {value && (
        <button
          onClick={() => onChange("")}
          className="px-2 py-1 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors w-fit"
        >
          Remove
        </button>
      )}
    </div>
  );
}

// ─── Platform-specific sidebar sections ───────────────────────

function TwitterSidebar({ data }: { data: TwitterPostData }) {
  const updateField = useEditorStore((s) => s.updateField);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Retweets" icon={Share2}>
          <NumberInput
            value={data.retweets}
            onChange={(v) => updateField("retweets", v)}
          />
        </FieldGroup>
        <FieldGroup label="Views" icon={Eye}>
          <NumberInput
            value={data.views}
            onChange={(v) => updateField("views", v)}
          />
        </FieldGroup>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Bookmarks" icon={Bookmark}>
          <NumberInput
            value={data.bookmarks}
            onChange={(v) => updateField("bookmarks", v)}
          />
        </FieldGroup>
        <FieldGroup label="Comments" icon={MessageSquare}>
          <NumberInput
            value={data.comments}
            onChange={(v) => updateField("comments", v)}
          />
        </FieldGroup>
      </div>
      <FieldGroup label="Quote Tweet" icon={Settings}>
        <Toggle
          value={data.isQuoteTweet}
          onChange={(v) => updateField("isQuoteTweet", v)}
          label="Include quoted tweet"
        />
      </FieldGroup>
      {data.isQuoteTweet && data.quotedTweet && (
        <div className="pl-3 border-l-2 border-indigo-500/30 space-y-3">
          <FieldGroup label="Quoted Name" icon={Type}>
            <TextInput
              value={data.quotedTweet.displayName}
              onChange={(v) =>
                updateField("quotedTweet", {
                  ...data.quotedTweet,
                  displayName: v,
                })
              }
              placeholder="Name"
            />
          </FieldGroup>
          <FieldGroup label="Quoted Handle" icon={Hash}>
            <TextInput
              value={data.quotedTweet.handle}
              onChange={(v) =>
                updateField("quotedTweet", {
                  ...data.quotedTweet,
                  handle: v,
                })
              }
              placeholder="handle"
            />
          </FieldGroup>
          <FieldGroup label="Quoted Text" icon={Type}>
            <TextInput
              value={data.quotedTweet.text}
              onChange={(v) =>
                updateField("quotedTweet", {
                  ...data.quotedTweet,
                  text: v,
                })
              }
              placeholder="Quoted tweet text"
              multiline
            />
          </FieldGroup>
        </div>
      )}
    </>
  );
}

function InstagramSidebar({ data }: { data: InstagramPostData }) {
  const updateField = useEditorStore((s) => s.updateField);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Comments" icon={MessageSquare}>
          <NumberInput
            value={data.comments}
            onChange={(v) => updateField("comments", v)}
          />
        </FieldGroup>
        <FieldGroup label="Shares" icon={Share2}>
          <NumberInput
            value={data.shares}
            onChange={(v) => updateField("shares", v)}
          />
        </FieldGroup>
      </div>
      <FieldGroup label="Location" icon={MapPin}>
        <TextInput
          value={data.location}
          onChange={(v) => updateField("location", v)}
          placeholder="e.g. Tokyo, Japan"
        />
      </FieldGroup>
      <FieldGroup label="Aspect Ratio" icon={Settings}>
        <div className="flex gap-2" role="radiogroup" aria-label="Aspect Ratio">
          {(["1:1", "4:5"] as const).map((ratio) => (
            <button
              key={ratio}
              role="radio"
              aria-checked={data.imageAspectRatio === ratio}
              onClick={() => updateField("imageAspectRatio", ratio)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                data.imageAspectRatio === ratio
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label="Sponsored" icon={Settings}>
        <Toggle
          value={data.sponsored}
          onChange={(v) => updateField("sponsored", v)}
          label="Show sponsored label"
        />
      </FieldGroup>
    </>
  );
}

function FacebookSidebar({ data }: { data: FacebookPostData }) {
  const updateField = useEditorStore((s) => s.updateField);

  return (
    <>
      <FieldGroup label="Comments" icon={MessageSquare}>
        <NumberInput
          value={data.comments}
          onChange={(v) => updateField("comments", v)}
        />
      </FieldGroup>
      <FieldGroup label="Privacy" icon={Shield}>
        <div className="flex gap-2" role="radiogroup" aria-label="Privacy">
          {(["public", "friends", "only_me"] as const).map((p) => (
            <button
              key={p}
              role="radio"
              aria-checked={data.privacy === p}
              onClick={() => updateField("privacy", p)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-colors capitalize ${
                data.privacy === p
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]"
              }`}
            >
              {p.replace("_", " ")}
            </button>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label="Shares" icon={Share2}>
        <NumberInput
          value={data.shares}
          onChange={(v) => updateField("shares", v)}
        />
      </FieldGroup>
      <FieldGroup label="Reactions" icon={Heart}>
        <div className="space-y-2">
          {(
            Object.entries(data.reactions) as [string, number][]
          ).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-sm w-12 capitalize">{key}</span>
              <span className="text-sm">
                {
                  {
                    like: "👍",
                    love: "❤️",
                    haha: "😂",
                    wow: "😮",
                    sad: "😢",
                    angry: "😡",
                  }[key]
                }
              </span>
              <input
                type="number"
                aria-label={`${key} reaction count`}
                value={val}
                onChange={(e) =>
                  updateField("reactions", {
                    ...data.reactions,
                    [key]: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                min={0}
              />
            </div>
          ))}
        </div>
      </FieldGroup>
    </>
  );
}

// ─── Toast ────────────────────────────────────────────────────

function Toast({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up max-w-[calc(100vw-3rem)]">
      <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium shadow-xl flex items-center gap-2">
        <CheckCircle2 size={16} className="text-green-400" />
        {message}
      </div>
    </div>
  );
}

// ─── Main Editor Page ─────────────────────────────────────────

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const platform = params.platform as Platform;
  const previewRef = useRef<HTMLDivElement>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [toast, setToast] = useState({ message: "", visible: false });

  const { postData, selectedField, setPostData, updateField, setSelectedField, toggleTheme, autofill, resetPost } =
    useEditorStore();

  // Initialize post data on mount
  useEffect(() => {
    if (!postData || postData.platform !== platform) {
      setPostData(getDefaultPost(platform));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, visible: true });
    toastTimeoutRef.current = setTimeout(() => setToast({ message: "", visible: false }), 2500);
  }, []);

  const handleExport = useCallback(async () => {
    if (!previewRef.current) return;
    // Clear selection for clean export
    setSelectedField(null);

    // Small delay to let deselection render
    await new Promise((r) => setTimeout(r, 100));

    const container = previewRef.current.querySelector("[data-post-container]");
    if (!container) return;

    try {
      const blob = await exportPost(container as HTMLElement, {
        format: exportFormat,
        backgroundColor: null,
      });
      const filename = `postmaker-${platform}-${Date.now()}.${exportFormat}`;
      await downloadBlob(blob, filename);
      showToast(`Exported as ${exportFormat.toUpperCase()}!`);
    } catch (err) {
      console.error("Export failed:", err);
      showToast("Export failed — try again");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, exportFormat, showToast]);

  const handleCopy = useCallback(async () => {
    if (!previewRef.current) return;
    setSelectedField(null);
    await new Promise((r) => setTimeout(r, 100));

    const container = previewRef.current.querySelector("[data-post-container]");
    if (!container) return;

    try {
      const blob = await exportPost(container as HTMLElement, {
        format: "png",
      });
      const success = await copyToClipboard(blob);
      showToast(success ? "Copied to clipboard!" : "Copy failed — try download instead");
    } catch {
      showToast("Copy failed — try download instead");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToast]);

  const handleAutofill = useCallback(() => {
    autofill();
    showToast("Auto-filled with meme data!");
  }, [autofill, showToast]);

  if (!postData || postData.platform !== platform) {
    return (
      <div role="status" aria-label="Loading" className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const data = postData as PostData;
  const isDark = data.theme === "dark";

  const platformNames = { twitter: "X (Twitter)", instagram: "Instagram", facebook: "Facebook" };
  const platformColors = { twitter: "text-sky-400", instagram: "text-pink-400", facebook: "text-blue-400" };

  return (
    <div className="flex flex-col h-screen overflow-auto sm:overflow-hidden">
      {/* ─── Top Bar ────────────────────────────────────────── */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              aria-label="Back to home"
              onClick={() => router.push("/")}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-sm font-semibold">{platformNames[platform]}</h1>
              <p className="text-[11px] text-[var(--muted)]">Post Editor</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={handleAutofill}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] hover:border-purple-500/30 hover:text-purple-400 transition-colors"
              title="Auto-fill with meme data"
            >
              <Wand2 size={13} />
              Auto-fill
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] hover:border-amber-500/30 hover:text-amber-400 transition-colors"
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
              {isDark ? "Light" : "Dark"}
            </button>

            <button
              onClick={() => {
                resetPost(platform);
                showToast("Reset to defaults");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] hover:border-red-500/30 hover:text-red-400 transition-colors"
              title="Reset"
            >
              <RotateCcw size={13} />
            </button>

            <div className="w-px h-6 bg-[var(--border)] mx-1" />

            <select
              aria-label="Export format"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs text-[var(--foreground)] focus:outline-none"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] hover:border-indigo-500/30 hover:text-indigo-400 transition-colors"
            >
              <Copy size={13} />
              Copy
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              <Download size={13} />
              Export
            </button>
          </div>

          <div className="flex sm:hidden items-center gap-1.5">
            <select
              aria-label="Export format"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs text-[var(--foreground)] focus:outline-none"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] hover:border-indigo-500/30 hover:text-indigo-400 transition-colors"
            >
              <Copy size={13} />
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              <Download size={13} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto sm:hidden">
          <button
            onClick={handleAutofill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] hover:border-purple-500/30 hover:text-purple-400 transition-colors whitespace-nowrap"
            title="Auto-fill with meme data"
          >
            <Wand2 size={13} />
            Auto-fill
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] hover:border-amber-500/30 hover:text-amber-400 transition-colors whitespace-nowrap"
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            {isDark ? "Light" : "Dark"}
          </button>

          <button
            onClick={() => {
              resetPost(platform);
              showToast("Reset to defaults");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] hover:border-red-500/30 hover:text-red-400 transition-colors whitespace-nowrap"
            title="Reset"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </header>

      {/* ─── Main Content ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row flex-1 sm:overflow-hidden">
        {/* Preview Area */}
        <div
          className="flex-1 flex items-center justify-center overflow-auto p-4 sm:p-6"
          style={{
            backgroundColor: isDark ? "#0a0a0f" : "#f0f0f5",
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(99,102,241,0.03) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168,85,247,0.03) 0%, transparent 50%)",
          }}
          onClick={() => setSelectedField(null)}
        >
          <div ref={previewRef} className="animate-scale-in">
            {/* Device frame hint */}
            <div
              className="rounded-xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: isDark
                  ? "0 25px 60px rgba(0,0,0,0.5)"
                  : "0 25px 60px rgba(0,0,0,0.15)",
              }}
            >
              {platform === "twitter" && (
                <TwitterRenderer
                  data={data as TwitterPostData}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              )}
              {platform === "instagram" && (
                <InstagramRenderer
                  data={data as InstagramPostData}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              )}
              {platform === "facebook" && (
                <FacebookRenderer
                  data={data as FacebookPostData}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside aria-label="Post properties editor" className="w-full sm:w-[320px] border-t sm:border-t-0 sm:border-l border-[var(--border)] bg-[var(--background)] overflow-y-auto flex-shrink-0">
          <div className="p-4">
            {/* Sidebar header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Settings size={14} className={platformColors[platform]} />
                Properties
              </h2>
            </div>

            {/* ─── Common Fields ──────────────────────── */}
            <FieldGroup label="Display Name" icon={Type}>
              <TextInput
                value={data.displayName}
                onChange={(v) => updateField("displayName", v)}
                placeholder="Display Name"
              />
            </FieldGroup>

            <FieldGroup label="Handle" icon={Hash}>
              <TextInput
                value={data.handle}
                onChange={(v) => updateField("handle", v)}
                placeholder="handle"
              />
            </FieldGroup>

            <FieldGroup label="Profile Picture" icon={ImageIcon}>
              <ImageUpload
                value={data.profileImage}
                onChange={(v) => updateField("profileImage", v)}
              />
            </FieldGroup>

            <FieldGroup label="Post Text" icon={Type}>
              <TextInput
                value={data.text}
                onChange={(v) => updateField("text", v)}
                placeholder="Write your post text..."
                multiline
              />
            </FieldGroup>

            <FieldGroup label="Timestamp" icon={Clock}>
              <TextInput
                value={data.timestamp}
                onChange={(v) => updateField("timestamp", v)}
                placeholder="e.g. 2h, Jan 15"
              />
            </FieldGroup>

            <FieldGroup label="Likes" icon={Heart}>
              <NumberInput
                value={data.likes}
                onChange={(v) => updateField("likes", v)}
              />
            </FieldGroup>

            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Media Image" icon={ImageIcon}>
                <ImageUpload
                  value={data.mediaImage}
                  onChange={(v) => updateField("mediaImage", v)}
                />
              </FieldGroup>

              <FieldGroup label="Verified Badge" icon={CheckCircle2}>
                <div className="flex flex-col gap-2">
                  <Toggle
                    value={data.verified}
                    onChange={(v) => updateField("verified", v)}
                    label="Verified"
                  />
                  {data.verified && (
                    <select
                      aria-label="Verified badge type"
                      value={data.verifiedType}
                      onChange={(e) =>
                        updateField("verifiedType", e.target.value)
                      }
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs text-[var(--foreground)] focus:outline-none"
                    >
                      <option value="blue">Blue</option>
                      <option value="gold">Gold</option>
                      <option value="business">Business</option>
                    </select>
                  )}
                </div>
              </FieldGroup>
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--border)] my-4" />

            {/* ─── Platform-specific Fields ───────────── */}
            <h3 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
              {platformNames[platform]} Options
            </h3>

            {platform === "twitter" && (
              <TwitterSidebar data={data as TwitterPostData} />
            )}
            {platform === "instagram" && (
              <InstagramSidebar data={data as InstagramPostData} />
            )}
            {platform === "facebook" && (
              <FacebookSidebar data={data as FacebookPostData} />
            )}
          </div>
        </aside>
      </div>

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
