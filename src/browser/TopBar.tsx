import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { setActiveTab, updateTabUrl } from "../state/browserSlice";
import { toggleAI } from "../state/aiSlice";
import { setWorkspace, WorkspaceId } from "../state/workspaceSlice";

const workspaceLabels: Record<WorkspaceId, string> = {
  dev: "Dev",
  research: "Research",
  creative: "Creative",
  system: "System",
};

export const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const { tabs, activeTabId } = useSelector((s: RootState) => s.browser);
  const workspace = useSelector((s: RootState) => s.workspace.active);
  const [address, setAddress] = useState("");

  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    if (activeTab) setAddress(activeTab.url);
  }, [activeTab?.id, activeTab?.url]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab) return;
    dispatch(updateTabUrl({ id: activeTab.id, url: address }));
  };

  return (
    <div className="p-2 bg-gradient-to-br from-[--xb-blue] to-[--xb-pink] border-b-2 border-[--xb-transPink] flex flex-col gap-1">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => dispatch(setActiveTab(tab.id))}
            className={`px-3 py-1 rounded-full text-xs ${
              tab.id === activeTabId
                ? "bg-black/40"
                : "bg-black/20"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <form onSubmit={handleAddressSubmit} className="flex-1">
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter URL or prompt…"
            className="w-full px-3 py-1 rounded-full bg-black/40 border border-white/30 text-xs"
          />
        </form>

        <select
          value={workspace}
          onChange={e => dispatch(setWorkspace(e.target.value as WorkspaceId))}
          className="px-3 py-1 rounded-full bg-black/40 text-xs"
        >
          {Object.entries(workspaceLabels).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>

        <button
          onClick={() => dispatch(toggleAI())}
          className="px-3 py-1 rounded-full bg-black/70 text-xs"
        >
          AI Panel
        </button>
      </div>
    </div>
  );
};
