type linkInfo = { url: string; favIconUrl: string; title: string };
chrome.storage.local.get(['urls'], (result) => {
  const linkInfoList = Object.values(result.urls || {}) as linkInfo[];
  console.log(result);
  console.log(linkInfoList);

  const list = document.getElementById('list');

  for (let linkInfo of linkInfoList) {
    const item = document.createElement('li');
    item.classList.add('list-item');

    const url = document.createElement('div');
    url.classList.add('url');

    const favicon = document.createElement('img');
    favicon.src = linkInfo.favIconUrl;
    favicon.classList.add('favicon');

    const domain = document.createElement('span');
    domain.classList.add('domain');
    domain.innerText = linkInfo.title || linkInfo.url;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.innerText = 'X';

    url.appendChild(favicon);
    url.appendChild(domain);

    item.appendChild(url);
    item.appendChild(deleteButton);

    list?.appendChild(item);
  }
});
