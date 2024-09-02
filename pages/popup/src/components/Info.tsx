import { INFO_IMG_PATH } from '@src/variables';

const Info = () => {
  return (
    <div className="hover:cursor-pointer">
      <img src={chrome.runtime.getURL(INFO_IMG_PATH)} alt="info img" />
    </div>
  );
};

export default Info;
