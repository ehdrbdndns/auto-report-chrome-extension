import { BaseStorage, createStorage } from './base';

// Tab Type
export type TabType = {
  [tabId: number]: {
    id: number; // tabId
    url: string;
    title: string;
    favIconUrl: string;
    lastAccessedTime: number;
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
  lastUsedUrl?: string;
};

type TabStorageType = BaseStorage<TabType> & {
  updateTab: (tabId: number, tabData: TabType[number]) => Promise<void>;
  deleteTab: (tabId: number) => Promise<void>;
  retrieveTab: (tabId: number) => Promise<TabType[number] | undefined>;
  updateLastUsedUrl: (url: string) => Promise<void>;
  getLastUrl: () => Promise<string | undefined>;
};

// Todo: subscribe for categoryData when it's updated
const storage = createStorage<TabType>('tab-storage-key', {});

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
  updateLastUsedUrl: async (url: string) => {
    await storage.set(cache => {
      cache.lastUsedUrl = url;

      return cache;
    });
  },
  getLastUrl: async () => {
    return storage.get().then(tabData => {
      return tabData.lastUsedUrl;
    });
  },
};
