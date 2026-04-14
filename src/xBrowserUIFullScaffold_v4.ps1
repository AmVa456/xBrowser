param(
    [string]$Root = "src"
)

# -----------------------------
# Helper: Safe directory create
# -----------------------------
function Ensure-Dir {
    param([string]$Path)
    if ($Path -and -not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

# -----------------------------
# Helper: Write file w/ prompt
# -----------------------------
function Write-FileWithPrompt {
    param(
        [string]$Path,
        [string]$Content
    )

    $dir = Split-Path $Path
    Ensure-Dir $dir

    if (Test-Path $Path) {
        Write-Host "File exists: $Path" -ForegroundColor Yellow
        $resp = Read-Host "Overwrite? (Y/N)"
        if ($resp -notin @("Y","y")) {
            Write-Host "Skipping $Path" -ForegroundColor DarkYellow
            return
        }
    }

    $Content | Set-Content -Path $Path -Encoding UTF8
    Write-Host "Wrote $Path" -ForegroundColor Green
}

# -----------------------------
# Dependency Checker
# -----------------------------
$requiredDeps = @(
    "react",
    "react-dom",
    "@reduxjs/toolkit",
    "react-redux"
)

$requiredDevDeps = @(
    "typescript",
    "vite",
    "@types/react",
    "@types/react-dom",
    "tailwindcss",
    "postcss",
    "autoprefixer",
    "@tailwindcss/postcss"
)

Write-Host "`nChecking dependencies..." -ForegroundColor Cyan

function Ensure-Dep {
    param(
        [string]$pkg,
        [switch]$Dev
    )

    $installed = pnpm list $pkg --depth -1 2>$null | Select-String $pkg

    if (-not $installed) {
        Write-Host "Missing: $pkg — installing..." -ForegroundColor Yellow
        if ($Dev) {
            pnpm add -D $pkg
        } else {
            pnpm add $pkg
        }
    } else {
        Write-Host "OK: $pkg" -ForegroundColor Green
    }
}

foreach ($d in $requiredDeps) {
    Ensure-Dep $d
}

foreach ($d in $requiredDevDeps) {
    Ensure-Dep $d -Dev
}

Write-Host "`nAll required dependencies installed." -ForegroundColor Cyan

# -----------------------------
# Tailwind v4 Correct Config
# -----------------------------
Write-FileWithPrompt -Path "tailwind.config.cjs" -Content @'
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {},
  plugins: [],
};
'@

Write-FileWithPrompt -Path "postcss.config.cjs" -Content @'
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
'@

# -----------------------------
# Tailwind v4 Token System
# -----------------------------
Write-FileWithPrompt -Path "$Root/tokens.css" -Content @'
@custom-media --xb-bg #050509;
@custom-media --xb-surface #0B0B12;
@custom-media --xb-surfaceAlt #11111A;
@custom-media --xb-text #F8F9FF;
@custom-media --xb-textMuted #A6A8C3;
@custom-media --xb-blue #A6E3FF;
@custom-media --xb-pink #FFAFCC;
@custom-media --xb-purple #CBA6F7;
@custom-media --xb-transBlue #5BCFFB;
@custom-media --xb-transPink #F5A9B8;
@custom-media --xb-transWhite #FFFFFF;
'@

Write-FileWithPrompt -Path "$Root/index.css" -Content @'
@import "./tokens.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

body {
  @apply bg-[--xb-bg] text-[--xb-text];
}

#root {
  @apply h-screen;
}
'@

# -----------------------------
# React App Entry
# -----------------------------
Write-FileWithPrompt -Path "$Root/main.tsx" -Content @'
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./state/store";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
'@

Write-FileWithPrompt -Path "$Root/App.tsx" -Content @'
import React from "react";
import { BrowserShell } from "./browser/BrowserShell";

const App: React.FC = () => {
  return <BrowserShell />;
};

export default App;
'@

# -----------------------------
# Redux State
# -----------------------------
Write-FileWithPrompt -Path "$Root/state/store.ts" -Content @'
import { configureStore } from "@reduxjs/toolkit";
import browserReducer from "./browserSlice";
import workspaceReducer from "./workspaceSlice";
import aiReducer from "./aiSlice";

export const store = configureStore({
  reducer: {
    browser: browserReducer,
    workspace: workspaceReducer,
    ai: aiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
'@

Write-FileWithPrompt -Path "$Root/state/browserSlice.ts" -Content @'
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
'@

Write-FileWithPrompt -Path "$Root/state/workspaceSlice.ts" -Content @'
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type WorkspaceId = "dev" | "research" | "creative" | "system";

interface WorkspaceState {
  active: WorkspaceId;
}

const initialState: WorkspaceState = {
  active: "dev",
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspace(state, action: PayloadAction<WorkspaceId>) {
      state.active = action.payload;
    },
  },
});

export const { setWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
'@

Write-FileWithPrompt -Path "$Root/state/aiSlice.ts" -Content @'
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AIState {
  isOpen: boolean;
  provider: string;
  prompt: string;
  isLoading: boolean;
}

const initialState: AIState = {
  isOpen: false,
  provider: "default",
  prompt: "",
  isLoading: false,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    toggleAI(state) {
      state.isOpen = !state.isOpen;
    },
    setProvider(state, action: PayloadAction<string>) {
      state.provider = action.payload;
    },
    setPrompt(state, action: PayloadAction<string>) {
      state.prompt = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { toggleAI, setProvider, setPrompt, setLoading } = aiSlice.actions;
export default aiSlice.reducer;
'@

# -----------------------------
# Browser Shell (Tailwind v4 tokens)
# -----------------------------
Write-FileWithPrompt -Path "$Root/browser/BrowserShell.tsx" -Content @'
import React from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { BrowserFrame } from "./BrowserFrame";
import { StatusBar } from "./StatusBar";
import { AIPanel } from "../ai/AIPanel";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

export const BrowserShell: React.FC = () => {
  const aiOpen = useSelector((s: RootState) => s.ai.isOpen);

  return (
    <div className="flex flex-col h-screen bg-[--xb-bg] text-[--xb-text]">
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex flex-1 relative min-w-0">
          <BrowserFrame />
          {aiOpen && <AIPanel />}
        </div>
      </div>
      <StatusBar />
    </div>
  );
};
'@

Write-FileWithPrompt -Path "$Root/browser/TopBar.tsx" -Content @'
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
'@

Write-FileWithPrompt -Path "$Root/browser/Sidebar.tsx" -Content @'
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
'@

Write-FileWithPrompt -Path "$Root/browser/BrowserFrame.tsx" -Content @'
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
'@

Write-FileWithPrompt -Path "$Root/browser/StatusBar.tsx" -Content @'
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
'@

# -----------------------------
# AI Panel (Tailwind v4 tokens)
# -----------------------------
Write-FileWithPrompt -Path "$Root/ai/AIPanel.tsx" -Content @'
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { setPrompt, setProvider, setLoading, toggleAI } from "../state/aiSlice";

export const AIPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { provider, prompt, isLoading } = useSelector((s: RootState) => s.ai);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 800);
  };

  return (
    <div className="w-80 border-l border-white/10 bg-[--xb-surfaceAlt] flex flex-col">
      <div className="p-3 bg-gradient-to-br from-[--xb-pink] to-[--xb-purple] flex items-center justify-between text-[--xb-text]">
        <span className="text-sm font-semibold">AI Panel</span>
        <button
          onClick={() => dispatch(toggleAI())}
          className="px-2 py-1 rounded-full bg-black/40 text-xs"
        >
          Close
        </button>
      </div>

      <div className="p-3 border-b border-white/10">
        <label className="text-[11px] text-[--xb-textMuted]">Provider</label>
        <select
          value={provider}
          onChange={e => dispatch(setProvider(e.target.value))}
          className="w-full mt-1 px-2 py-1 rounded bg-[--xb-surface] border border-white/20 text-xs"
        >
          <option value="default">Default</option>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
        </select>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3 border-b border-white/10"
      >
        <textarea
          value={prompt}
          onChange={e => dispatch(setPrompt(e.target.value))}
          placeholder="Ask xBrowser something…"
          className="w-full min-h-[80px] resize-vertical p-2 rounded bg-[--xb-surface] border border-white/20 text-xs"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-2 py-1 rounded-full text-xs font-semibold ${
            isLoading
              ? "bg-white/30 text-black"
              : "bg-gradient-to-br from-[--xb-blue] to-[--xb-pink] text-black"
          }`}
        >
          {isLoading ? "Thinking…" : "Send"}
        </button>
      </form>

      <div className="flex-1 p-3 text-xs text-[--xb-textMuted]">
        <p>Responses will appear here. Wire this to your provider registry next.</p>
      </div>
    </div>
  );
};
'@

# -----------------------------
# Minimal stubs for components
# -----------------------------
Write-FileWithPrompt -Path "$Root/ai/ProviderSelector.tsx" -Content @'
import React from "react";
export const ProviderSelector: React.FC = () => null;
'@

Write-FileWithPrompt -Path "$Root/workspace/WorkspaceDropdown.tsx" -Content @'
import React from "react";
export const WorkspaceDropdown: React.FC = () => null;
'@

Write-FileWithPrompt -Path "$Root/components/Icon.tsx" -Content @'
import React from "react";
export const Icon: React.FC<{ name: string }> = ({ name }) => <span>{name}</span>;
'@

Write-FileWithPrompt -Path "$Root/components/LoadingOverlay.tsx" -Content @'
import React from "react";
export const LoadingOverlay: React.FC = () => null;
'@

Write-Host ""
Write-Host "xBrowser Tailwind v4 UI scaffold written successfully." -ForegroundColor Cyan
Write-Host ""

$run = Read-Host "Run pnpm run dev now? (Y/N)"
if ($run -in @("Y","y")) {
    Write-Host "Starting Vite..." -ForegroundColor Cyan
    pnpm run dev
}
