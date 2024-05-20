chrome.storage.local.get({ urls: [] }, (result) => {
  console.log(JSON.stringify(result));
});
