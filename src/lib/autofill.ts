import {
  PostData,
  TwitterPostData,
  InstagramPostData,
  FacebookPostData,
  Platform,
} from "@/types";

const funnyNames = [
  "Dr. Meme Lord",
  "Chad Thundercock",
  "Based Department",
  "The Algorithm",
  "Shitpost Bot 9000",
  "Your Mom",
  "CEO of Terminal Brainrot",
  "Official Parody Account",
  "Guy Fieri's Ghost",
  "The Lorax (parody)",
];

const funnyHandles = [
  "verybased69",
  "shitpost_supreme",
  "not_a_bot_420",
  "real_human_person",
  "dril_wannabe",
  "big_brain_takes",
  "reply_guy_supreme",
  "engagement_farmer",
  "chronically_onlne",
  "npc_energy_420",
];

const funnyTexts = [
  "RT if you agree, like if you disagree",
  "Nobody:\n\nMe at 3am:",
  "This but unironically",
  "I'm going to say something controversial: water is wet",
  "POV: you just witnessed the greatest post of all time",
  "hot take: the sky is blue and pizza is good",
  "just vibing on main rn ngl",
  "this is the tweet that will end my career",
  "me explaining to my mom why this is funny",
  "breaking: local poster posts, film at 11",
  "ratio + L + no one asked + cope",
  "thinking about the roman empire",
  "i am once again asking for your financial support to buy a taco",
  "main character energy today tbh",
  "the vibes are simply immaculate",
];

const funnyLocations = [
  "Your Mom's House",
  "The Shadow Realm",
  "69 Hive Mind Blvd",
  "147.0.0.1 (localhost)",
  "The Void™",
  "Area 51",
  "Narnia",
  "Mom's Basement",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function funnyNumber(): number {
  const memes = [
    randomInt(69, 69),
    420,
    42069,
    69420,
    randomInt(1, 999) * 1000 + 420,
    randomInt(69000, 69999),
    80085,
    randomInt(100, 999) * 1000 + 69,
    1337,
    9001,
  ];
  return pick(memes);
}

const defaultAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231da1f2' width='100' height='100'/%3E%3Ccircle cx='50' cy='35' r='20' fill='white'/%3E%3Cellipse cx='50' cy='85' rx='35' ry='25' fill='white'/%3E%3C/svg%3E";

export function generateAutofill(platform: Platform): PostData {
  const name = pick(funnyNames);
  const handle = pick(funnyHandles);
  const text = pick(funnyTexts);
  const likes = funnyNumber();
  const comments = Math.floor(likes * (0.05 + Math.random() * 0.15));

  const base = {
    displayName: name,
    handle,
    profileImage: defaultAvatar,
    verified: Math.random() > 0.4,
    verifiedType: pick(["blue", "gold", "business"] as const),
    text,
    timestamp: pick(["2m", "15m", "1h", "2h", "5h", "12h", "1d", "3d", "Jan 15", "Dec 25"]),
    likes,
    comments,
    theme: "light" as const,
    mediaImage: "",
  };

  switch (platform) {
    case "twitter":
      return {
        ...base,
        platform: "twitter",
        retweets: Math.floor(likes * (0.1 + Math.random() * 0.3)),
        views: likes * randomInt(5, 20),
        bookmarks: Math.floor(likes * (0.02 + Math.random() * 0.1)),
        isQuoteTweet: Math.random() > 0.7,
        quotedTweet: {
          displayName: pick(funnyNames),
          handle: pick(funnyHandles),
          text: pick(funnyTexts),
          verified: Math.random() > 0.5,
        },
      } as TwitterPostData;

    case "instagram":
      return {
        ...base,
        platform: "instagram",
        shares: Math.floor(likes * (0.02 + Math.random() * 0.08)),
        captionTruncated: true,
        location: pick(funnyLocations),
        sponsored: Math.random() > 0.8,
        imageAspectRatio: pick(["1:1", "4:5"] as const),
      } as InstagramPostData;

    case "facebook":
      return {
        ...base,
        platform: "facebook",
        shares: Math.floor(likes * (0.05 + Math.random() * 0.1)),
        reactions: {
          like: likes,
          love: Math.floor(likes * 0.3),
          haha: Math.floor(likes * 0.15),
          wow: Math.floor(likes * 0.05),
          sad: Math.floor(likes * 0.02),
          angry: Math.floor(likes * 0.01),
        },
        topReactions: ["like", "love", "haha"],
        privacy: pick(["public", "friends"] as const),
      } as FacebookPostData;
  }
}
