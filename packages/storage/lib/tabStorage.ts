import { BaseStorage, createStorage } from './base';

// Tab Type
export type TabType = {
  [tabId: number]: {
    id: number; // tabId
    url: string;
    title: string;
    favIconUrl: string;
    lastAccessed: number;
    // active: boolean,
    // audible: boolean,
    // autoDiscardable: boolean,
    // discarded: boolean,
    // groupId: number,
    // height: number,
    // highlighted: boolean
    // incognito: boolean
    // index: number
    // mutedInfo: { muted: false }
    // pinned: boolean
    // selected: boolean
    // status: string
    // width: number
    // windowId: number
  };
  lastUsedTabId: number | null;
};

type TabStorageType = BaseStorage<TabType> & {
  updateLastUsedTabId: (tabId: number) => Promise<void>;
  updateTab: (tabId: number, tabData: TabType[number]) => Promise<void>;
  deleteTab: (tabId: number) => Promise<void>;
  retrieveTab: (tabId: number) => Promise<TabType[number]>;
  getLatestTabId: () => Promise<number | null>;
};

// Todo: subscribe for categoryData when it's updated
const storage = createStorage<TabType>('tab-storage-key', { lastUsedTabId: null });

export const tabStorage: TabStorageType = {
  ...storage,
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
  retrieveTab: async (tabId: number) => {
    return storage.get().then(tabData => {
      return tabData[tabId];
    });
  },
  updateLastUsedTabId: async (tabId: number) => {
    await storage.set(cache => {
      if (cache.lastUsedTabId !== tabId) {
        cache.lastUsedTabId = tabId;
      }

      return cache;
    });
  },
  getLatestTabId: async () => {
    return storage.get().then(tabData => {
      return tabData.lastUsedTabId;
    });
  },
};
