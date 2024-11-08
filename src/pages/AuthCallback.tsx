// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import supabase from '../services/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        console.error('Error retrieving session:', error.message);
        navigate('/login');
        return;
      }
      if (data.session) {
        console.log(data.session)
        dispatch(setUser(data.session.user));
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, dispatch]);

  return (
    <div>
      <h2>Processando autenticação...</h2>
    </div>
  );
};

export default AuthCallback;
