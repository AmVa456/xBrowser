import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { closeTab, openTab, setActiveTab } from "../state/browserSlice";

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { tabs, activeTabId } = useSelector((s: RootState) => s.browser);

  return (
    <div className="w-56 bg-gradient-to-b from-[--xb-blue] to-[--xb-purple] p-2 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold">Tabs</span>
        <button
          onClick={() =>
            dispatch(
              openTab({
                title: "New Tab",
                url: "about:blank",
                isInternal: true,
              })
            )
          }
          className="px-2 py-0.5 rounded-full bg-black/40 text-xs"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-black/30 rounded-lg p-1">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center p-1 rounded-md cursor-pointer gap-2 ${
              tab.id === activeTabId ? "bg-black/60" : ""
            }`}
            onClick={() => dispatch(setActiveTab(tab.id))}
          >
            <div className="w-4 h-4 rounded bg-white/30" />
            <div className="flex-1">
              <div className="text-xs truncate">{tab.title}</div>
              <div className="text-[10px] text-[--xb-textMuted] truncate">
                {tab.url}
              </div>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                dispatch(closeTab(tab.id));
              }}
              className="text-xs text-[--xb-textMuted]"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
