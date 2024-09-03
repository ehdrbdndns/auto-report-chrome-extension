/* eslint-disable @typescript-eslint/no-unused-vars */
import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import ContentWrapper from './components/ContentWrapper';
import Link from './components/Link';
import { SmallButton } from './components/Button';
import Deck from './components/Deck';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { CategoryType, LinkType } from './type';
import { RIGHT_IMG_PATH } from './variables';
import Info from './components/Info';

const Popup = () => {
  // Mock Data State Start
  const [linkData, setLinkData] = useState<LinkType>({
    'https://google.com1': { id: '1', title: '제목1', lastAccessed: 0, favIconUrl: '', visitedCount: 0, duration: 0 },
    'https://google.com2': { id: '2', title: '제목2', lastAccessed: 0, favIconUrl: '', visitedCount: 0, duration: 0 },
    'https://google.com3': { id: '3', title: '제목3', lastAccessed: 0, favIconUrl: '', visitedCount: 0, duration: 0 },
    'https://google.com4': { id: '4', title: '제목4', lastAccessed: 0, favIconUrl: '', visitedCount: 0, duration: 0 },
    'https://google.com5': { id: '5', title: '제목5', lastAccessed: 0, favIconUrl: '', visitedCount: 0, duration: 0 },
    'https://google.com6': { id: '6', title: '제목6', lastAccessed: 0, favIconUrl: '', visitedCount: 0, duration: 0 },
    'https://google.com7': { id: '7', title: '제목6', lastAccessed: 0, favIconUrl: '', visitedCount: 0, duration: 0 },
  });

  const [categoryData, setCategoryData] = useState<CategoryType>({
    default: { title: '방문한 링크', linkOrder: ['https://google.com1', 'https://google.com2', 'https://google.com3'] },
    '카테고리 1': { title: '카테고리 1', linkOrder: ['https://google.com4', 'https://google.com5'] },
    '카테고리 2': { title: '카테고리 2', linkOrder: ['https://google.com6', 'https://google.com7'] },
  });
  // Mock Data State End

  // --- requestAnimationFrame 초기화
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }
  // --- requestAnimationFrame 초기화 END

  const handleDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;

    const sourceId = source.droppableId;
    const sourceIndex = source.index;

    const destinationId = destination.droppableId;
    const destinationIndex = destination.index;

    // linkIndex of source
    const linkIndexOfSource = categoryData[sourceId].linkOrder[sourceIndex];

    // delete source link
    setCategoryData(prev => {
      prev[sourceId].linkOrder.splice(sourceIndex, 1);
      return { ...prev };
    });

    // add link order to destination
    setCategoryData(prev => {
      prev[destinationId].linkOrder.splice(destinationIndex, 0, linkIndexOfSource);
      return { ...prev };
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <section>
        {/* Header */}
        <header className="block mb-[1.6rem]">
          <h1 className="text-xl font-bold black">자동 보고서 생성기</h1>
        </header>
        {/* Main */}
        <div className="flex gap-[1.6rem]">
          {/* Left */}
          <ContentWrapper title="추적한 링크" titleActionEl={<Info />}>
            <Droppable droppableId="default">
              {provided => (
                <div
                  className="gap-[0.8rem] max-h-[41.6rem] min-h-[40rem] overflow-y-scroll"
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  {categoryData['default']['linkOrder'].map((url, index) => (
                    <Draggable key={`default-${url}`} draggableId={`default-link-${url}`} index={index}>
                      {provided => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Link
                            key={`default-${index}`}
                            title={linkData[url].title}
                            favIconUrl={linkData[url].favIconUrl}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </ContentWrapper>
          {/* Image */}
          <img src={chrome.runtime.getURL(RIGHT_IMG_PATH)} alt="right arrow img" />
          {/* Right */}
          <ContentWrapper title="분류한 링크" titleActionEl={<SmallButton text="분류관리" />}>
            <div className="flex flex-col gap-[1.2rem]">
              {Object.entries(categoryData)
                .filter(([category]) => category !== 'default')
                .map(([category, { title, linkOrder }]) => (
                  <Deck key={category} title={title}>
                    <Droppable droppableId={category}>
                      {provided => (
                        <div className="min-h-10" ref={provided.innerRef} {...provided.droppableProps}>
                          {/* Dropable */}
                          {linkOrder.map((url, index) => (
                            <Draggable
                              key={`${title}-link-${index}`}
                              draggableId={`${title}-link-${index}`}
                              index={index}>
                              {provided => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <Link
                                    key={`sorted-link-${title}-${url}`}
                                    title={linkData[url].title}
                                    favIconUrl={linkData[url].favIconUrl}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Deck>
                ))}
            </div>
          </ContentWrapper>
        </div>
      </section>
    </DragDropContext>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
