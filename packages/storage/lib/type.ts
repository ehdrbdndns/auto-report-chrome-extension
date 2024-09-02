// Last Used Tab ID
export type LastUsedTabId = number;

// Tab Type
export type TabType = {
  [tabId: number]: {
    active: boolean;
    audible: boolean;
    autoDiscardable: boolean;
    discarded: boolean;
    favIconUrl: string;
    groupId: number;
    height: number;
    highlighted: boolean;
    id: number;
    incognito: boolean;
    index: number;
    lastAccessed: number;
    mutedInfo: { muted: false };
    pinned: boolean;
    selected: boolean;
    status: string;
    title: string;
    url: string;
    width: number;
    windowId: number;
  };
};
// URL Type
// pages/popup/src/type.ts
// Type name: LinkType

// Category Type
// pages/popup/src/type.ts
// Type name: CategoryType
