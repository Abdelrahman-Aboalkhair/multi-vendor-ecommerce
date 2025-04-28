import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  role: string;
  avatar: string | null;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: User;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  user: {
    id: "",
    email: "",
    role: "",
    avatar: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      console.log("action.payload => ", action.payload);
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      console.log("aciton.payload => ", action.payload);
      state.user = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
    },

    clearAuthState: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = {
        id: "",
        email: "",
        role: "",
        avatar: null,
      };
    },
  },
});

export const { setAccessToken, clearAccessToken, setUser, clearAuthState } =
  authSlice.actions;

export default authSlice.reducer;
