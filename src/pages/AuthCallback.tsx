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
      console.log('AuthCallback: Iniciando handleAuthCallback');
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      console.log('AuthCallback: Obtidos accessToken e refreshToken:', accessToken, refreshToken);

      if (accessToken && refreshToken) {
        try {
          const response = await saveGoogleSessionToDatabase(accessToken, refreshToken);
          console.log('AuthCallback: User data from saveGoogleSessionToDatabase:', response);
          if (response.user) {
            dispatch(setTokens({ accessToken, refreshToken }));
            dispatch(setUser({ user: response.user, profileImage: response.user.picture }));
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            console.error('Error saving session: User data is undefined');
          }
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
