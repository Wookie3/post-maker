// ─── Platform Types ───────────────────────────────────────────

export type Platform = "twitter" | "instagram" | "facebook";
export type Theme = "light" | "dark";

export interface BasePostData {
  platform: Platform;
  theme: Theme;
  displayName: string;
  handle: string;
  profileImage: string; // base64 data URL or empty
  verified: boolean;
  verifiedType: "blue" | "gold" | "business";
  text: string;
  timestamp: string; // display string like "2h", "Jan 15", etc.
  likes: number;
  comments: number;
  mediaImage: string; // base64 data URL or empty
}

// ─── Twitter / X ──────────────────────────────────────────────

export interface TwitterPostData extends BasePostData {
  platform: "twitter";
  retweets: number;
  views: number;
  bookmarks: number;
  isQuoteTweet: boolean;
  quotedTweet?: {
    displayName: string;
    handle: string;
    text: string;
    verified: boolean;
  };
}

// ─── Instagram ────────────────────────────────────────────────

export interface InstagramPostData extends BasePostData {
  platform: "instagram";
  shares: number;
  captionTruncated: boolean;
  location: string;
  sponsored: boolean;
  imageAspectRatio: "1:1" | "4:5";
}

// ─── Facebook ─────────────────────────────────────────────────

export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

export interface FacebookPostData extends BasePostData {
  platform: "facebook";
  shares: number;
  reactions: Record<ReactionType, number>;
  topReactions: ReactionType[]; // show top 3
  privacy: "public" | "friends" | "only_me";
}

// ─── Union ────────────────────────────────────────────────────

export type PostData = TwitterPostData | InstagramPostData | FacebookPostData;

// ─── Template Metadata ────────────────────────────────────────

export interface Template {
  id: string;
  platform: Platform;
  name: string;
  description: string;
  icon: string; // emoji or icon key
}

// ─── Editor State ─────────────────────────────────────────────

export type EditableField =
  | "displayName"
  | "handle"
  | "text"
  | "timestamp"
  | "likes"
  | "comments"
  | "retweets"
  | "views"
  | "bookmarks"
  | "shares"
  | "profileImage"
  | "mediaImage"
  | "verified"
  | "verifiedType"
  | "location"
  | "privacy";
