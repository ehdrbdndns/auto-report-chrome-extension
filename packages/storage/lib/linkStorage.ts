import { BaseStorage, createStorage } from './base';

export type LinkType = {
  [url: string]: {
    title: string; // URL Title
    lastAccessedTime: number; // 가장 최근 방문한 시간, Unix Timestamp
    favIconUrl: string; // favicon URL
    visitedCount: number; // 방문 횟수
    duration: number; // 방문 시간
  };
};

type LinkStorage = BaseStorage<LinkType> & {
  updateLink: (url: string, linkData: LinkType[string]) => Promise<void>;
  deleteLink: (url: string) => Promise<void>;
  retrieveLink: (url: string) => Promise<LinkType[string] | undefined>;
};

const storage = createStorage<LinkType>('url-storage-key', {});

export const linkStorage: LinkStorage = {
  ...storage,
  updateLink: async (url: string, linkData: LinkType[string]) => {
    await storage.set(cache => {
      cache[url] = linkData;
      return cache;
    });
  },
  deleteLink: async (url: string) => {
    await storage.set(cache => {
      delete cache[url];
      return cache;
    });
  },
  retrieveLink: async (url: string) => {
    return storage.get().then(cache => {
      return cache[url];
    });
  },
};
