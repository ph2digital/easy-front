// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTokens, setUser } from '../store/authSlice';
import { saveGoogleSessionToDatabase, setSession } from '../services/authService';

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');

      if (accessToken && refreshToken) {
        try {
          const user = await saveGoogleSessionToDatabase(accessToken, refreshToken);
          dispatch(setTokens({ accessToken, refreshToken }));
          dispatch(setUser({ user, profileImage: user.picture }));
          setSession(accessToken, refreshToken); // Store tokens in local storage
          navigate('/home');
        } catch (error) {
          console.error('Error saving session:', error);
          navigate('/login');
        }
      } else {
        console.error('No access token or refresh token found');
        navigate('/login');
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
