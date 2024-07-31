import React, { PropsWithChildren } from 'react';

type ContentWrapperProps = PropsWithChildren<{ title: string; titleActionEl?: React.ReactNode }>;

const ContentWrapper = ({ title, titleActionEl, children }: ContentWrapperProps) => {
  return (
    <aside className=" w-[29.6rem] p-[1.6rem] border border-black box-content">
      {/* Header */}
      <header className="flex items-ceneter justify-between">
        {/* Title */}
        <h1 className="text-base font-semibold gray-900">{title}</h1>
        {/* Other Component */}
        {titleActionEl && titleActionEl}
      </header>
      <hr className="w-100 my-3 border-t border-[#4B5563]" />
      {/* Content With Scroll able */}
      <div>{children}</div>
    </aside>
  );
};

export default ContentWrapper;
