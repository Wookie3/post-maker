import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  PostData,
  TwitterPostData,
  InstagramPostData,
  FacebookPostData,
  Platform,
  Theme,
  Template,
} from "@/types";
import { generateAutofill } from "@/lib/autofill";
import indexedDBStorage from "@/lib/storage";

// ─── Templates ────────────────────────────────────────────────

export const TEMPLATES: Template[] = [
  {
    id: "twitter-tweet",
    platform: "twitter",
    name: "Tweet",
    description: "Standard X/Twitter post",
    icon: "𝕏",
  },
  {
    id: "instagram-post",
    platform: "instagram",
    name: "Photo Post",
    description: "Instagram image post with caption",
    icon: "📷",
  },
  {
    id: "facebook-status",
    platform: "facebook",
    name: "Status Update",
    description: "Facebook post with reactions",
    icon: "👍",
  },
];

// ─── Default Data Factories ───────────────────────────────────

function defaultTwitter(): TwitterPostData {
  return {
    platform: "twitter",
    theme: "light",
    displayName: "Display Name",
    handle: "handle",
    profileImage: "",
    verified: false,
    verifiedType: "blue",
    text: "This is a sample tweet. Tap any element to edit it!",
    timestamp: "2h",
    likes: 0,
    comments: 0,
    mediaImage: "",
    retweets: 0,
    views: 0,
    bookmarks: 0,
    isQuoteTweet: false,
  };
}

function defaultInstagram(): InstagramPostData {
  return {
    platform: "instagram",
    theme: "light",
    displayName: "displayname",
    handle: "handle",
    profileImage: "",
    verified: false,
    verifiedType: "blue",
    text: "This is a sample caption ✨ tap any element to edit! #meme #viral",
    timestamp: "2 HOURS AGO",
    likes: 0,
    comments: 0,
    mediaImage: "",
    shares: 0,
    captionTruncated: true,
    location: "",
    sponsored: false,
    imageAspectRatio: "1:1",
  };
}

function defaultFacebook(): FacebookPostData {
  return {
    platform: "facebook",
    theme: "light",
    displayName: "Display Name",
    handle: "",
    profileImage: "",
    verified: false,
    verifiedType: "blue",
    text: "This is a sample Facebook post. Tap any element to edit it!",
    timestamp: "2h",
    likes: 0,
    comments: 0,
    mediaImage: "",
    shares: 0,
    reactions: {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0,
    },
    topReactions: ["like", "love", "haha"],
    privacy: "public",
  };
}

export function getDefaultPost(platform: Platform): PostData {
  switch (platform) {
    case "twitter":
      return defaultTwitter();
    case "instagram":
      return defaultInstagram();
    case "facebook":
      return defaultFacebook();
  }
}

// ─── Store Interface ──────────────────────────────────────────

interface EditorState {
  // Current post data
  postData: PostData | null;
  // Currently selected/focused editable element
  selectedField: string | null;
  // App-level theme (separate from post theme)
  appTheme: Theme;

  // Actions
  setPostData: (data: PostData) => void;
  updateField: <K extends string>(key: K, value: unknown) => void;
  setSelectedField: (field: string | null) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  autofill: () => void;
  resetPost: (platform: Platform) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      postData: null,
      selectedField: null,
      appTheme: "dark",

      setPostData: (data) => set({ postData: data }),

      updateField: (key, value) => {
        const current = get().postData;
        if (!current) return;
        set({
          postData: { ...current, [key]: value },
        });
      },

      setSelectedField: (field) => set({ selectedField: field }),

      setTheme: (theme) => {
        const current = get().postData;
        if (current) {
          set({ postData: { ...current, theme } });
        }
      },

      toggleTheme: () => {
        const current = get().postData;
        if (current) {
          const next = current.theme === "light" ? "dark" : "light";
          set({ postData: { ...current, theme: next } });
        }
      },

      autofill: () => {
        const current = get().postData;
        if (!current) return;
        const filled = generateAutofill(current.platform);
        // Preserve the current theme choice
        filled.theme = current.theme;
        set({ postData: filled });
      },

      resetPost: (platform) => {
        set({ postData: getDefaultPost(platform), selectedField: null });
      },
    }),
    {
      name: "post-maker-storage",
      partialize: (state) => ({ postData: state.postData }),
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
