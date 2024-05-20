// Save default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
  console.log('onInstalled', reason);

  if (reason === 'install') {
    chrome.storage.local.set({
      apiSuggestions: ['tabs', 'storage', 'scripting'],
    });
  }
});
