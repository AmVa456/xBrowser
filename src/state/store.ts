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
