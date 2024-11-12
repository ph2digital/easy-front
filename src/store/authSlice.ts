// authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

interface AuthState {
  user: any;
  profileImage: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  profileImage: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any; profileImage: string | null }>) => {
      state.user = action.payload.user;
      state.profileImage = action.payload.profileImage;
      console.log('Usuário e imagem de perfil definidos:', state.user, state.profileImage);
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      console.log('Tokens definidos:', state.accessToken, state.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.profileImage = null;
      state.accessToken = null;
      state.refreshToken = null;
      console.log('Estado de autenticação redefinido para logout');
    },
  },
});

export const { setUser, setTokens, logout } = authSlice.actions;

// Selectors para acessar os dados de autenticação
export const selectUser = (state: RootState) => state.auth.user;
export const selectProfileImage = (state: RootState) => state.auth.profileImage;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;
