# PostMaker

A fake social media post screenshot generator built with Next.js, React, and Tailwind CSS. Create realistic-looking social media posts for Twitter/X, Instagram, and Facebook with a WYSIWYG editor, then export as PNG or JPEG.

## Features

- **3 Platforms** — Twitter/X tweets, Instagram photo posts, Facebook status updates
- **WYSIWYG Editor** — Click any element in the preview to select and edit it
- **Light & Dark Mode** — Toggle per-post theme for each platform
- **Auto-fill** — Generate random meme data with one click
- **Export** — Download as PNG or JPEG, or copy to clipboard
- **Mobile Friendly** — Responsive layout with stacked preview/sidebar on small screens
- **Accessible** — Keyboard-navigable editor, ARIA labels, WCAG color contrast, reduced-motion support

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Zustand](https://zustand.docs.pmnd.rs) (state management with persistence)
- [html2canvas](https://html2canvas.hertzen.com) (screenshot export)
- [Lucide React](https://lucide.dev) (icons)

## Getting Started

### Requirements

- **Node.js 22 LTS** (Node 25+ causes a bus error with Next.js 16)

```bash
nvm install 22
nvm use 22
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Home page with template cards
│   ├── layout.tsx                        # Root layout with fonts + skip link
│   ├── globals.css                       # Theme tokens & animations
│   └── editor/[platform]/page.tsx        # WYSIWYG editor page
├── components/
│   └── templates/
│       ├── twitter/TwitterRenderer.tsx    # Tweet preview renderer
│       ├── instagram/InstagramRenderer.tsx# Instagram post renderer
│       └── facebook/FacebookRenderer.tsx  # Facebook post renderer
├── stores/
│   └── editor.ts                         # Zustand store (persisted)
├── lib/
│   ├── export.ts                         # html2canvas export + clipboard
│   └── autofill.ts                       # Random meme data generator
└── types/
    └── index.ts                          # TypeScript type definitions
```

## Deploy

The easiest way to deploy is via [Vercel](https://vercel.com). See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other options.
