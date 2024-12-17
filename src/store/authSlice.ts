// authSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index'; // Corrected import path

interface AuthState {
  user: any;
  profileImage: string | null;
  googleAccessToken: string | null;
  googleRefreshToken: string | null;
  metaAccessToken: string | null;
  metaRefreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isCustomerLinked: boolean;
}

const initialState: AuthState = {
  user: null,
  profileImage: null,
  googleAccessToken: null,
  googleRefreshToken: null,
  metaAccessToken: null,
  metaRefreshToken: null,
  status: 'idle',
  error: null,
  isCustomerLinked: false,
};

export const validateToken = createAsyncThunk('auth/validateToken', async (token: string) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/validate-token`, { token });
  return response.data;
});

const STORAGE_KEY_GOOGLE = import.meta.env.VITE_STORAGE_KEY_GOOGLE || 'default-google-auth-token';
const STORAGE_KEY_META = import.meta.env.VITE_STORAGE_KEY_META || 'default-meta-auth-token';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any; profileImage: string | null }>) => {
      state.user = action.payload.user;
      state.profileImage = action.payload.profileImage;
    },
    setGoogleTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.googleAccessToken = action.payload.accessToken;
      state.googleRefreshToken = action.payload.refreshToken;
      localStorage.setItem(STORAGE_KEY_GOOGLE, JSON.stringify({ access_token: state.googleAccessToken, refresh_token: state.googleRefreshToken }));
    },
    setMetaTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.metaAccessToken = action.payload.accessToken;
      state.metaRefreshToken = action.payload.refreshToken;
      localStorage.setItem(STORAGE_KEY_META, JSON.stringify({ access_token: state.metaAccessToken, refresh_token: state.metaRefreshToken }));
    },
    setIsCustomerLinked: (state, action: PayloadAction<boolean>) => {
      state.isCustomerLinked = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.profileImage = null;
      state.googleAccessToken = null;
      state.googleRefreshToken = null;
      state.metaAccessToken = null;
      state.metaRefreshToken = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(STORAGE_KEY_GOOGLE);
      localStorage.removeItem(STORAGE_KEY_META);
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.googleAccessToken = action.payload.googleToken;
        state.metaAccessToken = action.payload.metaToken;
        state.profileImage = action.payload.user.picture; // Ensure profileImage is set
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user info in local storage
        localStorage.setItem(STORAGE_KEY_GOOGLE, JSON.stringify({ access_token: action.payload.googleToken, refresh_token: action.payload.googleRefreshToken }));
        localStorage.setItem(STORAGE_KEY_META, JSON.stringify({ access_token: action.payload.metaToken, refresh_token: action.payload.metaRefreshToken }));
        state.status = 'succeeded';
      })
      .addCase(validateToken.rejected, (state) => {
        state.user = null;
        state.googleAccessToken = null;
        state.googleRefreshToken = null;
        state.metaAccessToken = null;
        state.metaRefreshToken = null;
        state.status = 'idle';
        state.error = 'Invalid token';
      });
  },
});

export const { setUser, setGoogleTokens, setMetaTokens, logout, setIsCustomerLinked } = authSlice.actions;

// Selectors para acessar os dados de autenticação
export const selectUser = (state: RootState) => state.auth.user;
export const selectProfileImage = (state: RootState) => state.auth.profileImage;
export const selectGoogleAccessToken = (state: RootState) => state.auth.googleAccessToken;
export const selectMetaAccessToken = (state: RootState) => state.auth.metaAccessToken;

// Selector to check if the user is authenticated
export const selectIsAuthenticated = (state: RootState) => !!state.auth.googleAccessToken || !!state.auth.metaAccessToken;

// Selector to get the user's email
export const selectUserEmail = (state: RootState) => state.auth.user?.email;

export default authSlice.reducer;
