import { get, set, del } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

const STORAGE_KEY = "post-maker-storage";
const MIGRATION_KEY = "post-maker-migrated";

const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await get<string>(name);
    if (value) return value;

    const migrated = await get<boolean>(MIGRATION_KEY);
    if (migrated) return null;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        await set(name, raw);
        localStorage.removeItem(STORAGE_KEY);
        await set(MIGRATION_KEY, true);
        return raw;
      }
    } catch {
      // localStorage unavailable
    }
    await set(MIGRATION_KEY, true);
    return null;
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await set(name, value);
    } catch (err) {
      console.warn("Storage write failed:", err);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export default indexedDBStorage;
