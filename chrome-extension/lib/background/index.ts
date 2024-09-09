import 'webextension-polyfill';
import { exampleThemeStorage, linkStorage, tabStorage } from '@extension/storage';
import { createLinkWithCategory, getCurrentTab, logStorage } from '@root/utils/background';

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

  if (lastUsedUrl !== null) {
    const linkData = await linkStorage.retrieveLink(lastUsedUrl);

    if (linkData !== null) {
      linkData.duration += Date.now() - linkData.lastAccessedTime;
      linkData.lastAccessedTime = 0;

      await linkStorage.updateLink(lastUsedUrl, linkData);
    }
  }

  const linkData = await linkStorage.retrieveLink(tab.url);

  if (!linkData) {
    // create new linkData, and add linkOrder to default category
    await createLinkWithCategory({
      url: tab.url,
      title: tab.title || tab.url,
      favIconUrl: tab.favIconUrl || '',
    });
  } else {
    // 4-2. update linkData
    linkData.visitedCount += 1;
    linkData.duration += linkData.lastAccessedTime === 0 ? 0 : tab.lastAccessed - linkData.lastAccessedTime;
    linkData.lastAccessedTime = tab.lastAccessed;
    linkData.favIconUrl = tab.favIconUrl || '';
    linkData.title = tab.title || tab.url;

    await linkStorage.updateLink(tab.url, linkData);
  }

  await tabStorage.updateLastUsedUrl(tab.url);
  await tabStorage.updateTab(tabId, {
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

  // Todo: fix currentUrl, because it's not removed tab's url
  const tabData = await tabStorage.retrieveTab(tabId);

  if (!tabData) {
    throw new Error('tabData is null');
  }

  const { url: removedUrl, favIconUrl } = tabData;

  await tabStorage.deleteTab(tabId);

  console.log("removed tab's url", removedUrl);

  const lastUsedUrl = await tabStorage.getLastUrl();

  if (lastUsedUrl === removedUrl) {
    // update lastAccessedTime and duration of linkData in linkStorage and delete last used url
    const linkData = await linkStorage.retrieveLink(lastUsedUrl);

    if (linkData !== null) {
      linkData.duration += Date.now() - linkData.lastAccessedTime;
      linkData.lastAccessedTime = 0;
      linkData.visitedCount--;
      linkData.title = linkData.title || lastUsedUrl;

      await linkStorage.updateLink(lastUsedUrl, linkData);
    }

    await tabStorage.updateLastUsedUrl('');
  } else {
    // update lastAccessedTime of linkData in linkStorage to 0
    const linkData = await linkStorage.retrieveLink(removedUrl);

    if (linkData !== null) {
      linkData.lastAccessedTime = 0;
      linkData.favIconUrl = !linkData.favIconUrl ? favIconUrl : linkData.favIconUrl;
      linkData.title = linkData.title || removedUrl;

      await linkStorage.updateLink(removedUrl, linkData);
    }
  }

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
      linkData.title = linkData.title || lastUsedUrl;

      await linkStorage.updateLink(lastUsedUrl, linkData);
    }
  }

  const { url, title, favIconUrl } = await getCurrentTab();

  const linkData = await linkStorage.retrieveLink(url);

  if (!linkData) {
    await createLinkWithCategory({
      title: title || url,
      url: url,
      favIconUrl: favIconUrl || '',
    });
  } else {
    linkData.lastAccessedTime = Date.now();
    linkData.favIconUrl = !linkData.favIconUrl ? favIconUrl : linkData.favIconUrl;
    linkData.title = linkData.title || title || url;

    await linkStorage.updateLink(url, linkData);
  }

  // update last used url to current tab url
  await tabStorage.updateLastUsedUrl(url);

  // log storage for test
  logStorage();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${JSON.stringify(oldValue)}", new value is "${JSON.stringify(newValue)}".`,
    );
  }
});
