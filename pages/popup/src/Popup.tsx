import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import ContentWrapper from './components/ContentWrapper';
import Link from './components/Link';
import { SmallButton } from './components/Button';
import Deck from './components/Deck';
import { useState } from 'react';

const RIGHT_IMG_PATH = 'popup/right-arrow.svg';
const INFO_IMG_PATH = 'popup/info.svg';

type LinkProps = { url: string; id: string };
type LinkType = { [id: string]: { url: string; id: string } };
type CategoryType = { [category: string]: { title: string; linkOrder: string[] } };

const Info = () => {
  return (
    <div className="hover:cursor-pointer">
      <img src={chrome.runtime.getURL(INFO_IMG_PATH)} alt="info img" />
    </div>
  );
};

const Popup = () => {
  const [unsortedLinks, setUnsortedLinks] = useState<LinkProps[]>([
    { url: 'https://test.com', id: '1' },
    { url: 'https://tistory.com', id: '2' },
    { url: 'https://youtube.com', id: '3' },
  ]);

  const [sortedLinks, setSortedLinks] = useState<{ [category: string]: LinkProps[] }>({
    '카테고리 1': [
      { url: 'https://google.com', id: '1' },
      { url: 'https://google.com', id: '2' },
      { url: 'https://google.com', id: '3' },
    ],
    '카테고리 2': [
      { url: 'https://google.com', id: '1' },
      { url: 'https://google.com', id: '2' },
      { url: 'https://google.com', id: '3' },
    ],
  });

  const [links, setLinks] = useState<LinkType>({
    '1': { url: 'https://google.com', id: '1' },
    '2': { url: 'https://google.com', id: '2' },
    '3': { url: 'https://google.com', id: '3' },
    '4': { url: 'https://test.com', id: '4' },
    '5': { url: 'https://tistory.com', id: '5' },
    '6': { url: 'https://youtube.com', id: '6' },
    '7': { url: 'https://google.com', id: '7' },
    '8': { url: 'https://google.com', id: '8' },
    '9': { url: 'https://google.com', id: '9' },
    '10': { url: 'https://google.com', id: '10' },
  });

  const [categories, setCategories] = useState<CategoryType>({
    '카테고리 1': { title: '카테고리 2', linkOrder: ['4', '5', '6'] },
    '카테고리 2': { title: '카테고리 3', linkOrder: ['7', '8', '9', '10'] },
  });

  const [visitedLinks, setVisitedLinks] = useState<string[]>(['1', '2', '3']); // record linkOrder

  return (
    <section>
      {/* Header */}
      <header className="block mb-[1.6rem]">
        <h1 className="text-xl font-bold black">자동 보고서 생성기</h1>
      </header>
      {/* Main */}
      <div className="flex gap-[1.6rem]">
        {/* Left */}
        <ContentWrapper title="추적한 링크" titleActionEl={<Info />}>
          <div className="gap-[0.8rem] max-h-[41.6rem] overflow-y-scroll">
            {unsortedLinks.map((link, index) => (
              <Link key={`unsorted-link-${index}`} url={link.url} />
            ))}
          </div>
        </ContentWrapper>
        {/* Image */}
        <img src={chrome.runtime.getURL(RIGHT_IMG_PATH)} alt="right arrow img" />
        {/* Right */}
        <ContentWrapper title="분류한 링크" titleActionEl={<SmallButton text="분류관리" />}>
          <div className="flex flex-col gap-[1.2rem]">
            {Object.entries(sortedLinks).map(([category, links]) => (
              <Deck key={category} title={category}>
                {links.map((link, index) => (
                  <Link key={`sorted-link-${index}`} url={link.url} />
                ))}
              </Deck>
            ))}
          </div>
        </ContentWrapper>
      </div>
    </section>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
