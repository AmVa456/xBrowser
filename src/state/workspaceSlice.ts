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
