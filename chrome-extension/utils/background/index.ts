import { categoryStorage, linkStorage, tabStorage } from '@extension/storage';

const logStorage = async () => {
  // logging storage for test
  const linkData = linkStorage.getSnapshot();
  const tabData = tabStorage.getSnapshot();
  const categoryData = categoryStorage.getSnapshot();
  console.log('linkData', linkData);
  console.log('tabData', tabData);
  console.log('categoryData', categoryData);
};

export { logStorage };
