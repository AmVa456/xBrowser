import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

export const StatusBar: React.FC = () => {
  const workspace = useSelector((s: RootState) => s.workspace.active);
  const provider = useSelector((s: RootState) => s.ai.provider);

  return (
    <div className="border-t border-white/10 bg-[--xb-bg] px-3 py-1 text-[11px] flex items-center justify-between relative">
      <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-gradient-to-r from-[--xb-transBlue] via-[--xb-transPink] to-[--xb-transBlue]" />
      <span className="text-[--xb-textMuted]">Workspace: {workspace}</span>
      <span className="text-[--xb-textMuted]">Provider: {provider}</span>
    </div>
  );
};
