import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import ContentWrapper from './components/ContentWrapper';
import Link from './components/Link';
import { SmallButton } from './components/Button';
import Deck from './components/Deck';

const RIGHT_IMG_PATH = 'popup/right-arrow.svg';
const INFO_IMG_PATH = 'popup/info.svg';

const Info = () => {
  return (
    <div className="hover:cursor-pointer">
      <img src={chrome.runtime.getURL(INFO_IMG_PATH)} alt="info img" />
    </div>
  );
};

const Popup = () => {
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
            <Link url="https://naver.com" />
            <Link url="https://naver.com" />
          </div>
        </ContentWrapper>
        {/* Image */}
        <img src={chrome.runtime.getURL(RIGHT_IMG_PATH)} alt="right arrow img" />
        {/* Right */}
        <ContentWrapper title="분류한 링크" titleActionEl={<SmallButton text="분류관리" />}>
          <Deck title="카테고리 1">
            <Link url="https://naver.com" />
            <Link url="https://naver.com" />
            <Link url="https://naver.com" />
            <Link url="https://naver.com" />
            <Link url="https://naver.com" />
          </Deck>
        </ContentWrapper>
      </div>
    </section>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
