import { BaseStorage, createStorage } from './base';

export type CategoryType = {
  [category: string]: {
    title: string;
    linkOrder: string[];
  };
};

export type CategoryStorageType = BaseStorage<CategoryType> & {
  updateCategory: (category: string, categoryData: CategoryType[string]) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  retrieveCategory: (category: string) => Promise<CategoryType[string] | null>;
  deleteLinkOrder: ({
    category,
    deleteLink,
    deleteLinkOrderIndex,
  }: {
    category: string;
    deleteLink: string;
    deleteLinkOrderIndex?: number;
  }) => Promise<void>;
};

const storage = createStorage<CategoryType>('category-storage-key', {
  default: {
    title: 'default',
    linkOrder: [],
  },
});

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
  deleteLinkOrder: async ({ category, deleteLink, deleteLinkOrderIndex }) => {
    await storage.set(cache => {
      const linkOrder = cache[category].linkOrder;

      const deleteIndex =
        deleteLinkOrderIndex !== undefined ? deleteLinkOrderIndex : linkOrder.findIndex(link => link === deleteLink);

      linkOrder.splice(deleteIndex, 1);

      cache[category].linkOrder = linkOrder;
      return cache;
    });
  },
};
