import 'webextension-polyfill';
import { categoryStorage, exampleThemeStorage, linkStorage, tabStorage } from '@extension/storage';
import { logStorage } from '@root/utils/background';

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

  const lastUsedUrl = await tabStorage.getLastUrl();

  const updateUrl = lastUsedUrl ?? tab.url;

  if (!updateUrl) {
    throw new Error('updateUrl is null');
  }

  const linkData = await linkStorage.retrieveLink(updateUrl);

  if (!linkData) {
    // create new linkData, and add linkOrder to default category
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
    // 4-2. update linkData
    linkData.visitedCount += 1;
    linkData.duration += linkData.lastAccessedTime === 0 ? 0 : tab.lastAccessed - linkData.lastAccessedTime;
    linkData.lastAccessedTime = tab.lastAccessed;

    await linkStorage.updateLink(updateUrl, linkData);
  }

  await tabStorage.updateLastUsedUrl(tab.url);

  await tabStorage.updateTab(tab.id, {
    id: tab.id,
    url: tab.url,
    title: tab.title || tab.url,
    favIconUrl: tab.favIconUrl || '',
    lastAccessedTime: tab.lastAccessed,
  });

  // log storage for test
  logStorage();
});

// when the tab is removed, call the function
chrome.tabs.onRemoved.addListener(async tabId => {
  console.log('tab removed', tabId);

  const tabData = await tabStorage.retrieveTab(tabId);

  if (!tabData) {
    throw new Error('tabData is null');
  }

  const lastUsedUrl = await tabStorage.getLastUrl();

  if (!!lastUsedUrl && lastUsedUrl === tabData.url) {
    // update lastAccessedTime and duration of linkData in linkStorage and delete last used url
    const linkData = await linkStorage.retrieveLink(lastUsedUrl);

    if (linkData !== undefined && linkData !== null) {
      linkData.duration += Date.now() - linkData.lastAccessedTime;
      linkData.lastAccessedTime = 0;

      await linkStorage.updateLink(lastUsedUrl, linkData);
    }

    await tabStorage.updateLastUsedUrl('');
  } else {
    // update lastAccessedTime of linkData in linkStorage to 0
    const linkData = await linkStorage.retrieveLink(tabData.url);

    if (linkData !== undefined && linkData !== null) {
      linkData.lastAccessedTime = 0;

      await linkStorage.updateLink(tabData.url, linkData);
    }
  }

  await tabStorage.deleteTab(tabId);

  // log storage for test
  logStorage();
});

// when the tab is activated, call the function
chrome.tabs.onActivated.addListener(async activeInfo => {
  console.log('tab activated', activeInfo);

  // update last used url data
  const lastUsedUrl = await tabStorage.getLastUrl();

  if (lastUsedUrl !== null) {
    const linkData = await linkStorage.retrieveLink(lastUsedUrl);

    if (linkData !== null) {
      linkData.duration += Date.now() - linkData.lastAccessedTime;
      linkData.lastAccessedTime = Date.now();

      await linkStorage.updateLink(lastUsedUrl, linkData);
    }
  }

  const [tabData] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  if (!tabData || !tabData.url) {
    console.log('tabData: ' + tabData);
    throw new Error('tabData is null');
  }

  const linkData = await linkStorage.retrieveLink(tabData.url);

  if (!linkData) {
    await linkStorage.updateLink(tabData.url, {
      title: tabData.title || '',
      lastAccessedTime: Date.now(),
      favIconUrl: tabData.favIconUrl || '',
      visitedCount: 1,
      duration: 0,
    });

    const defaultCategory = await categoryStorage.retrieveCategory('default');

    if (!defaultCategory) {
      throw new Error('defaultCategory is null');
    }

    defaultCategory.linkOrder.push(tabData.url);
  } else {
    linkData.lastAccessedTime = Date.now();

    await linkStorage.updateLink(tabData.url, linkData);
  }

  // update last used url to current tab url
  await tabStorage.updateLastUsedUrl(tabData.url);

  // log storage for test
  logStorage();
});
