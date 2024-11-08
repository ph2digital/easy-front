// authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

interface AuthState {
  user: any;
  profileImage: string | null; // Adiciona o campo profileImage
}

const initialState: AuthState = {
  user: null,
  profileImage: null, // Define valor inicial para profileImage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload.user;
      state.profileImage = action.payload.profileImage; // Define profileImage ao definir o usuário
    },
    logout: (state) => {
      state.user = null;
      state.profileImage = null; // Limpa profileImage ao deslogar
    },
    clearUser: (state) => {
      state.user = null;
    },

  },
});

export const { setUser, logout,clearUser } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectProfileImage = (state: RootState) => state.auth.profileImage; // Selecionador para profileImage
export default authSlice.reducer;
