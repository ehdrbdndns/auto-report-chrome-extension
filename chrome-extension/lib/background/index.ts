import 'webextension-polyfill';
import { categoryStorage, exampleThemeStorage, linkStorage, tabStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');
console.log("Edit 'chrome-extension/lib/background/index.ts' and save to reload.");

// when the tab is created, call the function
chrome.tabs.onCreated.addListener(tab => {
  // Note that the tab's URL and tab group membership may not be set at the time this event is fired
  console.log('tab created', tab);
});

// when the tab is updated, call the function
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.lastAccessed || !tab.url || !tab.id) {
    return;
  }

  console.log('tab updated', tabId, changeInfo, tab);

  // 1. get last used url from tabStorage
  const lastUsedUrl = await tabStorage.getLastUrl();

  // 2. check if last used url is null
  // 2-1. if null, updateUrl is tab.url
  // 2-2. if not null, updateUrl is last used url
  const updateUrl = lastUsedUrl ?? tab.url;

  if (!updateUrl) {
    throw new Error('updateUrl is null');
  }

  // 3. get linkData from linkStorage by updateUrl
  const linkData = await linkStorage.retrieveLink(updateUrl);

  // 4. check if linkData is null
  if (!linkData) {
    // 4-1. if null, create new linkData, and add linkOrder to default category
    await linkStorage.updateLink(updateUrl, {
      title: tab.title || tab.url,
      lastAccessedTime: Date.now(), // 13 digit
      favIconUrl: tab.favIconUrl || '',
      visitedCount: 1,
      duration: 0,
    });

    const defaultCategory = await categoryStorage.retrieveCategory('default');

    if (!defaultCategory) {
      throw new Error('default category is null');
    }

    defaultCategory.linkOrder.push(updateUrl);
  } else {
    // 4-2. if not null, update linkData with lastAccessedTime and duration
    linkData.visitedCount += 1;
    linkData.duration += tab.lastAccessed - linkData.lastAccessedTime;
    linkData.lastAccessedTime = tab.lastAccessed;

    await linkStorage.updateLink(updateUrl, linkData);
  }

  // 5. update last used url to tabStorage
  await tabStorage.updateLastUsedUrl(tab.url);

  // 6. update tabStorage with tab data
  await tabStorage.updateTab(tab.id, {
    id: tab.id,
    url: tab.url,
    title: tab.title || tab.url,
    favIconUrl: tab.favIconUrl || '',
    lastAccessedTime: tab.lastAccessed,
  });

  // logging storage for test
  const logLinkData = await linkStorage.getSnapshot();
  const logTabData = await tabStorage.getSnapshot();
  console.log('logLinkData', logLinkData);
  console.log('logTabData', logTabData);
});

// when the tab is removed, call the function
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log('tab removed', tabId, removeInfo);

  // if prev active tab equal tabId, update prev active tab of lastAccessed and duration
  // remove prev active tab and tab
});

// when the tab is activated, call the function
chrome.tabs.onActivated.addListener(activeInfo => {
  console.log('tab activated', activeInfo);

  // if tab Data has activeInfo, then follow the below steps
  // 1. update prev active tab of lastAccessed and duration
  // 2. and update prev active tab to current active tab
});
