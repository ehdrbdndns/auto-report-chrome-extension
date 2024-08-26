import { PropsWithChildren, useState } from 'react';

const TOGGLE_IMG_PATH = 'popup/toggle.svg';

type DeckProps = PropsWithChildren<{ title: string }>;

export default function Deck({ title, children }: DeckProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`group ${isOpen ? 'open' : 'close'}`}>
      {/* header */}
      <button
        className={`
          w-[100%] flex justify-between items-center hover:opacity-[0.8] transition-opacity
          py-[0.8rem] px-[1.2rem] rounded-[0.8rem] cursor-pointer
        `}
        style={{ backgroundColor: '#DC9D7A' }}
        onClick={() => setIsOpen(prev => !prev)}>
        <span className="text-sm font-bold white">{title}</span>
        <img
          className={`
          transition-transform duration-300
          group-[.open]:rotate-90 group-[.close]:rotate-0
        `}
          src={chrome.runtime.getURL(TOGGLE_IMG_PATH)}
          alt="토글 버튼"
        />
      </button>
      {/* list */}
      <div
        className={`
          rounded-[0.6rem] overflow-y-scroll
          transition-[max-height] duration-500
          group-[.open]:max-h-[16rem] group-[.close]:max-h-[0]
        `}>
        <div className="py-[1rem] px-[0.4rem] border bg-gray-50 gap-[0.4rem] rounded-[0.6rem]">
          {/* Internal Data */}
          {children}
        </div>
      </div>
    </div>
  );
}
