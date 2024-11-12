// src/services/authService.ts
import api from './api';
import supabase from './supabaseClient';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store/store';
import { Session } from '@supabase/supabase-js';

export const signInWithGoogle = async () => {
  console.log('Iniciando o processo de login com Google...');

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error('Erro durante o login com Google:', error.message);
    throw new Error('Erro durante o login com Google');
  }
  console.log('Redirecionado para Google OAuth');
};

// Função de login via API com email e senha
export const login = async (email: string, password: string) => {
  return await api.post('/auth/login', { email, password });
};

// Função para obter sessão do token local armazenado
export const getSessionFromLocalStorage = () => {
  const storedToken = localStorage.getItem('sb-auth-token');
  return storedToken ? JSON.parse(storedToken) : null;
};

// Função para configurar sessão no Supabase e no localStorage
export const setSession = async (accessToken: string, refreshToken: string) => {
  localStorage.setItem('sb-auth-token', JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
  const { error, data } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (error) console.error('Erro ao configurar sessão:', error.message);
  return data?.session;
};

// Função para limpar sessão local e no Supabase
export const clearSession = () => {
  localStorage.removeItem('sb-auth-token');
  supabase.auth.signOut();
};

// Função de login com Facebook
export const loginWithFacebook = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
  });

  if (error) {
    console.error('Erro de login com Facebook:', error.message);
  } else {
    console.log('Redirecionado para autenticação com Facebook:', data.url);
  }
};

// Função para salvar a sessão do Google no banco de dados e manter a sincronia do `sessionID`
export const saveGoogleSessionToDatabase = async (session: Session) => {
  if (session && session.user) {
    const user_id = session.user.id;
    console.log('Salvando sessão para o usuário:', user_id);

    // Atualiza `is_active` para false nos tokens antigos
    const { error: deactivateError } = await supabase
      .from('linked_accounts')
      .update({ is_active: false })
      .eq('user_id', user_id)
      .eq('account_type', 'google_ads');

    if (deactivateError) {
      console.error('Erro ao desativar tokens antigos:', deactivateError.message);
      throw new Error('Erro ao desativar tokens antigos');
    }

    const { access_token, refresh_token } = session;
    console.log('Novo Access Token:', access_token);
    console.log('Novo Refresh Token:', refresh_token);

    // Insere o novo token vinculado ao `user_id`
    const { error: insertError } = await supabase.from('linked_accounts').upsert({
      user_id,
      account_type: 'google_ads',
      access_token,
      refresh_token,
      is_active: true,
    });

    if (insertError) {
      console.error('Erro ao salvar nova sessão no Supabase:', insertError.message);
      throw new Error('Erro ao salvar nova sessão no banco de dados');
    }

    console.log('Nova sessão do Google Ads salva com sucesso para o usuário:', user_id);
  } else {
    console.error('Sessão ou tokens de autenticação não disponíveis para salvar');
  }
};

// Outros métodos
export const logoutUser = async (dispatch: AppDispatch) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao fazer logout:', error);
  } else {
    dispatch(logout());
  }
};
