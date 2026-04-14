import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

const InternalPage: React.FC<{ url: string }> = ({ url }) => {
  if (url === "about:welcome") {
    return (
      <div className="p-8 flex flex-col gap-4">
        <h1 className="text-2xl">xBrowser</h1>
        <p className="text-[--xb-textMuted] max-w-lg">
          AI-native browser shell · pastel gradients · trans-flag highlights · xSeries core.
        </p>
      </div>
    );
  }

  if (url === "about:settings") {
    return (
      <div className="p-6">
        <h2 className="text-lg mb-2">Settings</h2>
        <p className="text-[--xb-textMuted]">Settings panel placeholder.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <p className="text-[--xb-textMuted]">Internal page: {url}</p>
    </div>
  );
};

export const BrowserFrame: React.FC = () => {
  const { tabs, activeTabId } = useSelector((s: RootState) => s.browser);
  const activeTab = tabs.find(t => t.id === activeTabId);

  if (!activeTab) {
    return (
      <div className="flex-1 bg-[--xb-surface] flex items-center justify-center text-[--xb-textMuted]">
        No active tab
      </div>
    );
  }

   if (activeTab.isInternal || activeTab.url.startsWith("about:")) {
    return (
      <div className="flex-1 bg-[--xb-surface]">
        <InternalPage url={activeTab.url} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[--xb-surface]">
      <iframe
        src={activeTab.url}
        className="w-full h-full border-none"
        title={activeTab.title}
      />
    </div>
  );
};
