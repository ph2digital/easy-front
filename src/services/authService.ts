// src/services/authService.ts
import axios from 'axios';
import api from './api';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store/index';

const API_URL = import.meta.env.VITE_API_URL || '';

// Função de login via API com email e senha
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return {
    ...response.data,
    user: {
      ...response.data.user,
      profileImage: response.data.user.profileImage, // Ensure profileImage is included
    },
  };
};

// Função para obter sessão do token local armazenado
export const getSessionFromLocalStorage = () => {
  const storedToken = localStorage.getItem('auth-token');
  return storedToken ? JSON.parse(storedToken) : null;
};

// Função para configurar sessão no localStorage
export const setSession = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('auth-token', JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
};

// Função para limpar sessão local
export const clearSession = () => {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user');
};

// Outros métodos
export const logoutUser = async (dispatch: AppDispatch) => {
  try {
    await axios.post(`${API_URL}/auth/logout`);
    clearSession();
    dispatch(logout());
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

export const signInWithGoogle = async () => {
  console.log('Iniciando o processo de login com Google...');
  try {
    const response = await axios.get(`${API_URL}/auth/google`);
    if (response.status === 200) {
      window.location.href = response.data.authUrl;
    } else {
      console.error('Erro ao iniciar o login com Google:', response.statusText);
      throw new Error('Erro ao iniciar o login com Google');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Erro ao iniciar o login com Google:', error.response.data);
    } else if (axios.isAxiosError(error) && error.request) {
      console.error('Erro ao iniciar o login com Google: Nenhuma resposta recebida', error.request);
    } else if (error instanceof Error) {
      console.error('Erro ao iniciar o login com Google:', error.message);
    } else {
      console.error('Erro ao iniciar o login com Google:', error);
    }
    throw new Error('Erro ao iniciar o login com Google');
  }
};

export const saveGoogleSessionToDatabase = async (accessToken: string, refreshToken: string) => {
  try {
    console.log('Tentando salvar sessão no banco de dados com accessToken:', accessToken, 'e refreshToken:', refreshToken);
    const response = await axios.post(`${API_URL}/auth/save-session`, { accessToken, refreshToken });

    setSession(accessToken, refreshToken);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Erro ao salvar sessão no banco de dados:', error.response.data);
    } else if (axios.isAxiosError(error) && error.request) {
      console.error('Erro ao salvar sessão no banco de dados: Nenhuma resposta recebida', error.request);
    } else if (error instanceof Error) {
      console.error('Erro ao salvar sessão no banco de dados:', error.message);
    } else {
      console.error('Erro ao salvar sessão no banco de dados:', error);
    }
    throw new Error('Erro ao salvar sessão no banco de dados');
  }
};

export const validateToken = async (token: string) => {
  console.log('authService: Validating token:', token);
  const response = await axios.post(`${API_URL}/auth/validate-token`, { token });
  console.log('authService: validateToken response:', response.data);
  return response.data;
};

