"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { TEMPLATES } from "@/stores/editor";
import { Template, Platform } from "@/types";

const platformColors: Record<Platform, string> = {
  twitter: "from-sky-500 to-blue-600",
  instagram: "from-pink-500 via-purple-500 to-orange-400",
  facebook: "from-blue-600 to-blue-700",
};

const platformBorders: Record<Platform, string> = {
  twitter: "hover:border-sky-500/50",
  instagram: "hover:border-pink-500/50",
  facebook: "hover:border-blue-500/50",
};

const platformDescriptions: Record<Platform, string[]> = {
  twitter: [
    "Tweet text, media, metrics",
    "Verified badges",
    "Quote tweets",
    "Light & dark mode",
  ],
  instagram: [
    "Photo posts with captions",
    "Likes, comments, shares",
    "Location tags",
    "Light & dark mode",
  ],
  facebook: [
    "Status updates",
    "Reaction breakdowns",
    "Privacy indicators",
    "Light & dark mode",
  ],
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <Mail size={18} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                PostMaker
              </h1>
              <p className="text-xs text-[var(--muted)]">
                Fake Social Media Post Generator
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="px-2 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
              3 platforms
            </span>
            <span className="px-2 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
              WYSIWYG editor
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Create realistic social media posts
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto text-base">
              Choose a platform template below, then customize every detail.
              Export pixel-perfect screenshots as PNG or JPEG.
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {TEMPLATES.map((template: Template) => (
              <Link
                key={template.id}
                href={`/editor/${template.platform}`}
                className={`group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:scale-[1.02] ${platformBorders[template.platform]}`}
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${platformColors[template.platform]} opacity-0 group-hover:opacity-5 transition-opacity`}
                />

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platformColors[template.platform]} flex items-center justify-center text-2xl mb-4 shadow-lg`}
                >
                  {template.icon}
                </div>

                {/* Info */}
                <h3 className="text-lg font-semibold mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-[var(--muted)] mb-4">
                  {template.description}
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5">
                  {platformDescriptions[template.platform].map((feature) => (
                    <span
                      key={feature}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="absolute top-6 right-6 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-4">
        <div className="max-w-6xl mx-auto text-center text-xs text-[var(--muted)]">
          PostMaker — For entertainment purposes only
        </div>
      </footer>
    </div>
  );
}
