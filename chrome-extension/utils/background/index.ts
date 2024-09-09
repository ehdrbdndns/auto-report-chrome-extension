import { categoryStorage, linkStorage, tabStorage } from '@extension/storage';

const isDev = true;

const logStorage = async () => {
  // logging storage for test
  if (isDev) {
    const linkData = linkStorage.getSnapshot();
    const tabData = tabStorage.getSnapshot();
    const categoryData = categoryStorage.getSnapshot();
    console.log('linkData', linkData);
    console.log('tabData', tabData);
    console.log('categoryData', categoryData);
  }
};

const createLinkWithCategory = async ({
  url,
  title,
  favIconUrl,
}: {
  url: string;
  title: string;
  favIconUrl: string;
}) => {
  await linkStorage.updateLink(url, {
    title: title,
    lastAccessedTime: Date.now(), // 13 digit
    favIconUrl: favIconUrl,
    visitedCount: 1,
    duration: 0,
  });

  const defaultCategory = await categoryStorage.retrieveCategory('default');
  console.log('defaultCategory', defaultCategory);

  if (!defaultCategory) {
    throw new Error('default category is null');
  }

  // defaultCategory.linkOrder.push(url);
  const newLinkOrder = [...defaultCategory.linkOrder, url];
  defaultCategory.linkOrder = newLinkOrder;

  const categoryData = await categoryStorage.get();
  console.log('categoryData', categoryData);

  await categoryStorage.updateCategory('default', defaultCategory);
  const changedCategoryData = await categoryStorage.get();
  console.log('changed defaultCategory', defaultCategory);
  console.log('changed categoryData', changedCategoryData);
};

const getCurrentTab = async () => {
  const [tabData] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  if (!tabData) {
    throw new Error('tabData is null');
  }

  if (!tabData.url && !tabData.pendingUrl) {
    throw new Error('tabData.url is null and tabData.pendingUrl is not null');
  }

  const url = tabData.url || tabData.pendingUrl;
  if (!url) {
    throw new Error('url is null');
  }

  return { title: tabData.title || '', url: url, favIconUrl: tabData.favIconUrl || '' };
};

export { logStorage, createLinkWithCategory, getCurrentTab };
