import { BaseStorage, createStorage } from './base';

// Tab Type
export type TabType = {
  [tabId: number]: {
    // active: boolean,
    // audible: boolean,
    // autoDiscardable: boolean,
    // discarded: boolean,
    favIconUrl: string;
    // groupId: number,
    // height: number,
    // highlighted: boolean
    id: number; // tabId
    // incognito: boolean
    // index: number
    lastAccessed: number;
    // mutedInfo: { muted: false }
    // pinned: boolean
    // selected: boolean
    // status: string
    title: string;
    url: string;
    // width: number
    // windowId: number
  };
  lastUsedTabId: number;
};

type TabStorageType = BaseStorage<TabType> & {
  updateLastUsedTabId: (tabId: number) => Promise<void>;
  updateTab: (tabId: number, tabData: TabType[number]) => Promise<void>;
  deleteTab: (tabId: number) => Promise<void>;
};

// Todo: subscribe for categoryData when it's updated
const storage = createStorage<TabType>('tab-storage-key', { lastUsedTabId: 0 });

export const tabStorage: TabStorageType = {
  ...storage,
  updateLastUsedTabId: async (tabId: number) => {
    await storage.set(cache => {
      if (cache.lastUsedTabId !== tabId) {
        cache.lastUsedTabId = tabId;
      }

      return cache;
    });
  },
  updateTab: async (tabId: number, tabData: TabType[number]) => {
    await storage.set(cache => {
      cache[tabId] = tabData;
      return cache;
    });
  },
  deleteTab: async (tabId: number) => {
    await storage.set(cache => {
      delete cache[tabId];
      return cache;
    });
  },
};
