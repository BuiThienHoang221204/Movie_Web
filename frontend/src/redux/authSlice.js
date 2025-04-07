import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
      state.user = null;
    },
    updateUserField: (state, action) => {
      state.user = { ...state.user, ...action.payload }; // Partial user updates
    },
  },
});

export const { setAccessToken, clearAccessToken, setUser, updateUserField } = authSlice.actions;

export const selectAccessToken = (state) => state.auth.accessToken; // Selector để lấy accessToken
export const selectUser = (state) => state.auth.user; // Selector để lấy user

export default authSlice.reducer;