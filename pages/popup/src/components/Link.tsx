const DEFULAT_FAVICON_IMG_PATH = 'popup/default-favicon.png';

export default function Link({ favicon, url }: { favicon?: string; url: string }) {
  return (
    <div
      className={`
        group flex items-center justify-between py-[0.6rem] px-[1.2rem] 
        rounded-[0.7rem] hover:bg-gray-200 cursor-pointer
      `}>
      {/* Favicon */}
      <div className="w-4/5 flex items-center">
        <img
          className="w-[1.8rem] h-[1.8rem] mr-[0.8rem]"
          src={chrome.runtime.getURL(favicon ?? DEFULAT_FAVICON_IMG_PATH)}
          alt="URL favicon"
        />
        {/* URL */}
        <span className="group-hover:font-bold text-sm">{url}</span>
      </div>
      {/* Delete Button */}
      <button className="group-hover:font-bold text-sm">x</button>
    </div>
  );
}
