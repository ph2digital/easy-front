// src/services/authService.ts
import api from './api';
import supabase from './supabaseClient';
import { logout } from '../store/authSlice'; // Removi `clearUser`, mantendo apenas `logout`
import { AppDispatch } from '../store/store';

// Função de login via API
export const login = async (email: string, password: string) => {
  return await api.post('/auth/login', { email, password });
};

// Função de logout
export const logoutUser = async (dispatch: AppDispatch) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
  } else {
    dispatch(logout());
  }
};

// Login com Google
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  
  if (error) throw new Error('Error during Google sign-in');
};

// Obter sessão do token local armazenado
export const getSessionFromLocalStorage = () => {
  const storedToken = localStorage.getItem('sb-auth-token');
  return storedToken ? JSON.parse(storedToken) : null;
};

// Configurar sessão no Supabase e no localStorage
export const setSession = async (accessToken: string, refreshToken: string) => {
  localStorage.setItem('sb-auth-token', JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
  const { error, data } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (error) console.error('Error setting session:', error.message);
  return data?.session;
};

// Limpar sessão local e no Supabase
export const clearSession = () => {
  localStorage.removeItem('sb-auth-token');
  supabase.auth.signOut();
};

// Login com Facebook
export const loginWithFacebook = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
  });

  if (error) {
    console.error('Erro de login:', error.message);
  } else {
    console.log('Redirecionado para autenticação com Facebook:', data.url);
  }
};
