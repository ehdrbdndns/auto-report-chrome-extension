export type LinkType = {
  [url: string]: {
    id: string; // tab Id
    title: string; // URL Title
    lastAccessed: number; // 가장 최근 방문한 시간, Unix Timestamp
    favIconUrl: string; // favicon URL
    visitedCount: number; // 방문 횟수
    duration: number; // 방문 시간
  };
};
export type CategoryType = {
  [category: string]: {
    title: string;
    linkOrder: string[];
  };
};
