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
}

const initialState: AuthState = {
  user: null,
  profileImage: null,
  accessToken: null,
  refreshToken: null,
  token: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
  return response.data;
});

export const validateToken = createAsyncThunk('auth/validateToken', async (token: string) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/validate-token`, { token });
  return response.data;
});

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
      localStorage.setItem('auth-token', JSON.stringify({ access_token: state.accessToken, refresh_token: state.refreshToken }));
      console.log('Tokens definidos:', state.accessToken, state.refreshToken);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.profileImage = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user');
      console.log('Estado de autenticação redefinido para logout');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.profileImage = action.payload.user.picture; // Ensure profileImage is set
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user info in local storage
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.profileImage = action.payload.user.picture; // Ensure profileImage is set
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user info in local storage
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

export const { setUser, setTokens, setToken, logout } = authSlice.actions;

// Selectors para acessar os dados de autenticação
export const selectUser = (state: RootState) => state.auth.user;
export const selectProfileImage = (state: RootState) => state.auth.profileImage;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

// Selector to check if the user is authenticated
export const selectIsAuthenticated = (state: RootState) => !!state.auth.accessToken;

export default authSlice.reducer;
