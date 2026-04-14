import React from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { BrowserFrame } from "./BrowserFrame";
import { StatusBar } from "./StatusBar";
import { AIPanel } from "../ai/AIPanel";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { xTheme } from "../theme/theme";

export const BrowserShell: React.FC = () => {
  const aiOpen = useSelector((s: RootState) => s.ai.isOpen);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: xTheme.background,
        color: xTheme.text,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <TopBar />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar />
        <div style={{ display: "flex", flex: 1, position: "relative", minWidth: 0 }}>
          <BrowserFrame />
          {aiOpen && <AIPanel />}
        </div>
      </div>
      <StatusBar />
    </div>
  );
};
