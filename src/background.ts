chrome.tabs.onCreated.addListener((tab) => {
  console.log('Tab created:', tab);

  // Check if the tab has a URL
  if (!tab.url) {
    return;
  }

  storeUrlToStorage(tab.url);
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  console.log('Tab updated:', tab);

  // Check if the tab has a URL
  if (!changeInfo.url || !tab.url) {
    return;
  }

  storeUrlToStorage(tab.url);
});

const storeUrlToStorage = (url: string) => {
  console.log('Storing URL:', url);

  // Retrieve the list of URLs from storage
  chrome.storage.local.get({ urls: [] }, (result) => {
    const updatedUrls = [...result.urls, { url, timestamp: Date.now() }];

    // Save the updated list of URLs to storage
    chrome.storage.local.set({ urls: updatedUrls });
  });
};
