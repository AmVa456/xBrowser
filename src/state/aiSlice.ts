import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { providers, ProviderName } from "../ai/providers";

interface AIHistoryEntry {
  id: string;
  prompt: string;
  response: string;
  provider: ProviderName;
  createdAt: string;
}

interface AIState {
  isOpen: boolean;
  provider: ProviderName;
  prompt: string;
  isLoading: boolean;
  response: string;
  error: string | null;
  history: AIHistoryEntry[];
}

const initialState: AIState = {
  isOpen: false,
  provider: "anthropic",
  prompt: "",
  isLoading: false,
  response: "",
  error: null,
  history: [],
};

export const sendPrompt = createAsyncThunk<
  { text: string; id: string },
  void,
  { state: RootState }
>("ai/sendPrompt", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const { provider, prompt } = state.ai;

  if (!prompt.trim()) {
    return rejectWithValue("Prompt is empty.");
  }

  const fn = providers[provider] ?? providers.default;

  try {
    const res = await fn(prompt);
    const id = crypto.randomUUID();
    return { text: res.text, id };
  } catch (err: any) {
    return rejectWithValue(err?.message || "AI request failed.");
  }
});

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    toggleAI(state) {
      state.isOpen = !state.isOpen;
    },
    setProvider(state, action: PayloadAction<ProviderName>) {
      state.provider = action.payload;
    },
    setPrompt(state, action: PayloadAction<string>) {
      state.prompt = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearResponse(state) {
      state.response = "";
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendPrompt.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPrompt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.response = action.payload.text;
        const entry: AIHistoryEntry = {
          id: action.payload.id,
          prompt: state.prompt,
          response: action.payload.text,
          provider: state.provider,
          createdAt: new Date().toISOString(),
        };
        state.history.unshift(entry);
      })
      .addCase(sendPrompt.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "AI request failed.";
      });
  },
});

export const { toggleAI, setProvider, setPrompt, setLoading, clearResponse } =
  aiSlice.actions;
export default aiSlice.reducer;
