import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/types";

const TOKEN_STORAGE_KEY = "auth-token";

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called right after login: we have both the token and the profile.
    setCredentials(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
    },
    // Called on page load when a token is already saved, once /users/me
    // resolves with the profile that goes with it.
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
