export default function TooltipContent({
  title,
  duration,
  visitedCount,
}: {
  title: string;
  duration: number;
  visitedCount: number;
}) {
  const miniute = Math.floor(duration / (1000 * 60));

  return (
    <div className="max-w-[330px]">
      <h1>{title}</h1>
      <hr className="w-100 my-3 border-t border-[#4B5563]" />
      <div>
        <p>방문 횟수: {visitedCount}</p>
        <p>방문 시간: {miniute === 0 ? '1분 미만' : miniute + ' 분'}</p>
      </div>
    </div>
  );
}
