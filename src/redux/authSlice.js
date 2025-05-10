import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token") || "";

const authSlice = createSlice({
  name: "auth",
  initialState: { token },
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem("token", action.payload);
      state.token = action.payload;
    },
    clearToken: (state) => {
      localStorage.removeItem("token");
      state.token = "";
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;

