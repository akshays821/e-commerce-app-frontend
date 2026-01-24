import { createSlice } from "@reduxjs/toolkit";

// load user auth from localStorage (on refresh)
const token = localStorage.getItem("userToken");
const user = localStorage.getItem("userInfo");

const initialState = {
  token: token || null,
  user: user ? JSON.parse(user) : null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;

      // persist login
      localStorage.setItem("userToken", action.payload.token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify(action.payload.user)
      );
    },

    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
    },

    clearError(state) {
      state.error = null;
    },

    registerSuccess(state) {
      state.loading = false;
      state.error = null;
    },

    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("userInfo", JSON.stringify(state.user));
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  registerSuccess,
  updateUser,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
