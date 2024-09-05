/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import '@src/Popup.css';
import { Tooltip } from 'flowbite-react';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { categoryStorage, linkStorage } from '@extension/storage';
import { CategoryType } from '@extension/storage/lib/categoryStorage';

import { RIGHT_IMG_PATH } from './variables';

import Deck from './components/Deck';
import Info from './components/Info';
import Link from './components/Link';
import TooltipContent from './components/TooltipContent';
import { SmallButton } from './components/Button';
import ContentWrapper from './components/ContentWrapper';

const Popup = () => {
  const linkData = useStorageSuspense(linkStorage);
  const categoryData = useStorageSuspense(categoryStorage);
  const [categoryState, setCategoryState] = useState<CategoryType>({});

  useEffect(() => {
    setCategoryState(categoryData);
  }, [categoryData]);

  // --- requestAnimationFrame 초기화
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      // console.log(categoryData);
      // console.log(linkData);
      setEnabled(true);
    });

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }
  // --- requestAnimationFrame 초기화 END

  const handleDragEnd = async ({ destination, source }: DropResult) => {
    if (!destination) return;

    const sourceId = source.droppableId;
    const sourceIndex = source.index;

    const destinationId = destination.droppableId;
    const destinationIndex = destination.index;

    // linkIndex of source
    const linkIndexOfSource = categoryState[sourceId].linkOrder[sourceIndex];

    const newCategoryState = { ...categoryState };
    newCategoryState[sourceId].linkOrder.splice(sourceIndex, 1);
    newCategoryState[destinationId].linkOrder.splice(destinationIndex, 0, linkIndexOfSource);

    setCategoryState(newCategoryState); // 상태 업데이트
    await categoryStorage.updateCategory(sourceId, newCategoryState[sourceId]);
    await categoryStorage.updateCategory(destinationId, newCategoryState[destinationId]);
  };

  return (
    <div className="relative">
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
                  <div className="h-[41.6rem] overflow-y-scroll" ref={provided.innerRef} {...provided.droppableProps}>
                    {categoryState['default']['linkOrder'].map((url, index) => (
                      <Draggable key={`default-${url}`} draggableId={`default-link-${url}`} index={index}>
                        {provided => (
                          <div
                            className="[&>.w-fit]:w-[100%]"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <Tooltip
                              content={
                                <TooltipContent
                                  title={linkData[url].title}
                                  duration={linkData[url].duration}
                                  visitedCount={linkData[url].visitedCount}
                                />
                              }
                              placement="right">
                              <Link
                                key={`default-${index}`}
                                title={linkData[url].title}
                                favIconUrl={linkData[url].favIconUrl}
                              />
                            </Tooltip>
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
                {Object.entries(categoryState)
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
                                  <div
                                    className="[&>.w-fit]:w-[100%]"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                    <Tooltip
                                      content={
                                        <TooltipContent
                                          title={linkData[url].title}
                                          duration={linkData[url].duration}
                                          visitedCount={linkData[url].visitedCount}
                                        />
                                      }>
                                      <Link
                                        key={`sorted-link-${title}-${url}`}
                                        title={linkData[url].title}
                                        favIconUrl={linkData[url].favIconUrl}
                                      />
                                    </Tooltip>
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
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
