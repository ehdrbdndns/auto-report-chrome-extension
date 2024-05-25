chrome.tabs.onCreated.addListener((tab) => {
  const { url, status } = tab;

  // Check if the tab has a URL
  if (!url || status !== 'complete') {
    return;
  }

  storeUrlToStorage(tab);
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  const { url, status } = tab;

  // Check if the tab has a URL
  if (!url || status !== 'complete') {
    return;
  }

  storeUrlToStorage(tab);
});

const storeUrlToStorage = (tab: chrome.tabs.Tab) => {
  console.log('Tab updated:', tab);
  const { id, url, favIconUrl, title } = tab;

  if (!id) {
    return;
  }

  // Retrieve the list of URLs from storage
  chrome.storage.local.get(['urls'], (result) => {
    if (!result.urls) {
      result.urls = {};
    }

    if (!result.urls[id]) {
      result.urls[id] = {};
    }

    result.urls[id] = { url, favIconUrl, title };

    console.log(result.urls);

    // Save the updated list of URLs to storage
    chrome.storage.local.set({
      urls: { ...result.urls },
    });
  });
};
