// src/services/authService.ts
import api from './api';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store/store';



// Função de login via API com email e senha
export const login = async (email: string, password: string) => {
  return await api.post('/auth/login', { email, password });
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
};


// Outros métodos
export const logoutUser = async (dispatch: AppDispatch) => {
  try {
    await api.post('/auth/logout');
    clearSession();
    dispatch(logout());
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};









export const signInWithGoogle = async () => {
  console.log('Iniciando o processo de login com Google...');
  try {
    const response = await api.get('/auth/google');
    window.location.href = response.data.authUrl;
  } catch (error) {
    console.error('Erro ao iniciar o login com Google:', error);
    throw new Error('Erro ao iniciar o login com Google');
  }
};

export const saveGoogleSessionToDatabase = async (accessToken: string, refreshToken: string) => {
  try {
    const response = await api.post('/auth/save-session', { accessToken, refreshToken });
    // Store tokens in local storage
    setSession(accessToken, refreshToken);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar sessão no banco de dados:', error);
    throw new Error('Erro ao salvar sessão no banco de dados');
  }
};
