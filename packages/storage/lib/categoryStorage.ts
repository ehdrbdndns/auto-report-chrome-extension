import { BaseStorage, createStorage } from './base';

export type CategoryType = {
  [category: string]: {
    title: string;
    linkOrder: string[];
  };
};

type CategoryStorageType = BaseStorage<CategoryType> & {
  updateCategory: (category: string, categoryData: CategoryType[string]) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  retrieveCategory: (category: string) => Promise<CategoryType[string]>;
};

const storage = createStorage<CategoryType>('category-storage-key', {});

export const categoryStorage: CategoryStorageType = {
  ...storage,
  updateCategory: async (category: string, categoryData: CategoryType[string]) => {
    await storage.set(cache => {
      cache[category] = categoryData;
      return cache;
    });
  },
  deleteCategory: async (category: string) => {
    await storage.set(cache => {
      delete cache[category];
      return cache;
    });
  },
  retrieveCategory: async (category: string) => {
    return storage.get().then(categoryData => {
      return categoryData[category];
    });
  },
};
