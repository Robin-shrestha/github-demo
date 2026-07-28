import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// The signed-in user's data — kept in the store so any component can read it.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthUser>) {
      console.log("🚀 ~ action:", action);
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
