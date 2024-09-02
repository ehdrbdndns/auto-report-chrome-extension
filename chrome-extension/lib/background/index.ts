import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

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
  console.log('tab updated', tabId, changeInfo, tab);
  // if tab Data has tabId, then follow the below steps
  // 1.
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
