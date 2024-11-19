// authSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index'; // Corrected import path

interface AuthState {
  user: any;
  profileImage: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isCustomerLinked: boolean;
}

const initialState: AuthState = {
  user: null,
  profileImage: null,
  accessToken: null,
  refreshToken: null,
  token: null,
  status: 'idle',
  error: null,
  isCustomerLinked: false,
};

export const validateToken = createAsyncThunk('auth/validateToken', async (token: string) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/validate-token`, { token });
  return response.data;
});

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'default-auth-token';

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ access_token: state.accessToken, refresh_token: state.refreshToken }));
      console.log('Tokens definidos:', state.accessToken, state.refreshToken);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setFacebookToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setIsCustomerLinked: (state, action: PayloadAction<boolean>) => {
      state.isCustomerLinked = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.profileImage = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('user');
      console.log('Estado de autenticação redefinido para logout');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.profileImage = action.payload.user.picture; // Ensure profileImage is set
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user info in local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ access_token: action.payload.token, refresh_token: action.payload.refreshToken }));
        state.status = 'succeeded';
      })
      .addCase(validateToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.token = null;
        state.status = 'idle';
        state.error = 'Invalid token';
      });
  },
});

export const { setUser, setTokens, setToken, logout, setFacebookToken, setIsCustomerLinked } = authSlice.actions;

// Selectors para acessar os dados de autenticação
export const selectUser = (state: RootState) => state.auth.user;
export const selectProfileImage = (state: RootState) => state.auth.profileImage;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

// Selector to check if the user is authenticated
export const selectIsAuthenticated = (state: RootState) => !!state.auth.accessToken;

// Selector to get the user's email
export const selectUserEmail = (state: RootState) => state.auth.user?.email;

export default authSlice.reducer;
