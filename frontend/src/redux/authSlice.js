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
    clearAccessToken: (state) => {
      state.accessToken = null;
      state.user = null; // Cũng xóa thông tin người dùng nếu cần
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setAccessToken, clearAccessToken, setUser } = authSlice.actions;

export const selectAccessToken = (state) => state.auth.accessToken; // Selector để lấy accessToken

export default authSlice.reducer;