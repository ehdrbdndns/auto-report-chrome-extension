import 'webextension-polyfill';
import { exampleThemeStorage, tabStorage } from '@extension/storage';
import { TabType } from '@extension/storage/lib/tabStorage';

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
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') {
    return;
  }

  console.log('tab updated', tabId, changeInfo, tab);

  // 1. get lastUsedTabId from tabStorage

  // 2. update visitedCount and duration of lastUsedTab on UrlStorage

  // 3. update lastUsedTabId from tabStorage

  // 4. update tab data on tabStorage
  const tabData: TabType[number] = {
    id: tab.id || 0,
    url: tab.url || '',
    title: tab.title || '',
    favIconUrl: tab.favIconUrl || '',
    lastAccessed: tab.lastAccessed || 0,
  };
  tabStorage.updateTab(tabId, tabData);

  // 5. update categoryData on categoryStorage
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
