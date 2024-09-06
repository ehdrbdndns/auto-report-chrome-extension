export default function TooltipContent({
  title,
  duration,
  visitedCount,
  url,
}: {
  title: string;
  duration: number;
  visitedCount: number;
  url: string;
}) {
  const miniute = Math.floor(duration / (1000 * 60));

  const handleNavigation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await chrome.tabs.create({ url });
  };

  return (
    <div className="max-w-[330px]">
      <button className="group" onClick={e => handleNavigation(e)}>
        <span className="group-hover:font-bold text-left flex">{title}</span>
        <span className="group-hover:font-bold text-left flex">{'(클릭시 링크 이동)'}</span>
      </button>
      <hr className="w-100 my-3 border-t border-[#4B5563]" />
      <div>
        <p>방문 횟수: {visitedCount}</p>
        <p>방문 시간: {miniute === 0 ? '1분 미만' : miniute + ' 분'}</p>
      </div>
    </div>
  );
}
