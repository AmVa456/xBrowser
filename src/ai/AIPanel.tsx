import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import {
  setPrompt,
  setProvider,
  toggleAI,
  clearResponse,
} from "../state/aiSlice";
import { sendPrompt } from "../state/aiSlice";

export const AIPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { provider, prompt, isLoading, response, error, history } = useSelector(
    (s: RootState) => s.ai
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearResponse());
    // @ts-ignore
    dispatch(sendPrompt());
  };

  return (
    <div className="w-80 border-l border-white/10 bg-[--xb-surfaceAlt] flex flex-col">
      <div className="p-3 bg-gradient-to-br from-[--xb-pink] to-[--xb-purple] flex items-center justify-between text-[--xb-text]">
        <span className="text-sm font-semibold">AI Panel (Anthropic)</span>
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
          onChange={e =>
            dispatch(setProvider(e.target.value as any))
          }
          className="w-full mt-1 px-2 py-1 rounded bg-[--xb-surface] border border-white/20 text-xs"
        >
          <option value="anthropic">Anthropic (Claude 3 Haiku)</option>
          <option value="default">Default (Mock)</option>
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

      <div className="flex-1 p-3 text-xs text-[--xb-textMuted] overflow-y-auto space-y-3">
        {error && (
          <div className="p-2 rounded bg-red-500/10 border border-red-500/40 text-[11px] text-red-200">
            {error}
          </div>
        )}

        {response && !error && (
          <div className="p-2 rounded bg-black/30 border border-white/10 whitespace-pre-wrap text-[11px] text-[--xb-text]">
            {response}
          </div>
        )}

        {history.length > 0 && (
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-[10px] uppercase tracking-wide text-[--xb-textMuted]">
              History
            </div>
            {history.map(entry => (
              <div
                key={entry.id}
                className="p-2 rounded bg-black/20 border border-white/5"
              >
                <div className="text-[10px] text-[--xb-textMuted] mb-1">
                  {new Date(entry.createdAt).toLocaleTimeString()} ·{" "}
                  {entry.provider}
                </div>
                <div className="text-[11px] text-[--xb-text] mb-1">
                  <span className="font-semibold">You:</span> {entry.prompt}
                </div>
                <div className="text-[11px] text-[--xb-textMuted] whitespace-pre-wrap">
                  <span className="font-semibold">AI:</span> {entry.response}
                </div>
              </div>
            ))}
          </div>
        )}

        {!response && !error && history.length === 0 && (
          <p>
            Responses will appear here. Make sure your Anthropic server is
            running and X_ANTHROPIC_API_KEY is set.
          </p>
        )}
      </div>
    </div>
  );
};
