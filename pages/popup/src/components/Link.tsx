const DEFULAT_FAVICON_IMG_PATH = 'popup/default-favicon.png';

export default function Link({ title, favIconUrl }: { title: string; favIconUrl?: string }) {
  const MAX_TITLE_LENGTH = 25;
  const truncatedTitle = title.length > MAX_TITLE_LENGTH ? title.slice(0, MAX_TITLE_LENGTH) + '...' : title;

  return (
    <div
      className={`
        group/link link flex items-center justify-between py-[0.6rem] px-[1.2rem] 
        rounded-[0.7rem] hover:bg-gray-200 cursor-pointer
      `}>
      <div className="w-5/6 flex items-center">
        {/* Favicon */}
        <img
          className="w-[1.8rem] h-[1.8rem] mr-[0.8rem]"
          src={favIconUrl ? favIconUrl : chrome.runtime.getURL(DEFULAT_FAVICON_IMG_PATH)}
          alt="URL favicon"
        />
        {/* URL */}
        <span
          className={`
            block
            text-sm whitespace-nowrap
            overflow-hidden overflow-ellipsis
        `}>
          {truncatedTitle}
        </span>
      </div>
      {/* Delete Button */}
      <button className="text-sm">x</button>
    </div>
  );
}
