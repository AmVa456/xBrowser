import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Tab {
  id: string;
  title: string;
  url: string;
  isInternal: boolean;
}

interface BrowserState {
  tabs: Tab[];
  activeTabId: string | null;
}

const initialState: BrowserState = {
  tabs: [
    { id: "1", title: "Welcome to xBrowser", url: "about:welcome", isInternal: true },
  ],
  activeTabId: "1",
};

const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    openTab(state, action: PayloadAction<Partial<Tab>>) {
      const id = crypto.randomUUID();
      const tab: Tab = {
        id,
        title: action.payload.title ?? "New Tab",
        url: action.payload.url ?? "about:blank",
        isInternal: !!action.payload.isInternal,
      };
      state.tabs.push(tab);
      state.activeTabId = id;
    },
    closeTab(state, action: PayloadAction<string>) {
      state.tabs = state.tabs.filter(t => t.id !== action.payload);
      if (state.activeTabId === action.payload) {
        state.activeTabId = state.tabs[0]?.id ?? null;
      }
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTabId = action.payload;
    },
    updateTabUrl(state, action: PayloadAction<{ id: string; url: string }>) {
      const tab = state.tabs.find(t => t.id === action.payload.id);
      if (tab) tab.url = action.payload.url;
    },
    updateTabTitle(state, action: PayloadAction<{ id: string; title: string }>) {
      const tab = state.tabs.find(t => t.id === action.payload.id);
      if (tab) tab.title = action.payload.title;
    },
  },
});

export const { openTab, closeTab, setActiveTab, updateTabUrl, updateTabTitle } =
  browserSlice.actions;
export default browserSlice.reducer;
