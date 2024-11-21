// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTokens, setUser } from '../store/authSlice';
import { saveGoogleSessionToDatabase, saveMetaSessionToDatabase, saveFacebookSessionToDatabase, setSession } from '../services/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('AuthCallback: Iniciando handleAuthCallback');
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const metaAccessToken = urlParams.get('meta_access_token');
      const facebookAccessToken = urlParams.get('facebook_access_token');
      console.log('AuthCallback: Obtidos accessToken e refreshToken:', accessToken, refreshToken);

      if (accessToken && refreshToken) {
        try {
          const response = await saveGoogleSessionToDatabase(accessToken, refreshToken);
          console.log('AuthCallback: User data from saveGoogleSessionToDatabase:', response);
          if (response.user) {
            dispatch(setTokens({ accessToken, refreshToken }));
            dispatch(setUser({ user: response.user, profileImage: response.user.picture }));
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log('User email:', response.user.email); // Log the user's email
          } else {
            console.error('Error saving session: User data is undefined');
          }
          setSession(accessToken, refreshToken); // Store tokens in local storage
          if (window.opener) {
            window.opener.location.href = '/home';
            window.close();
          } else {
            navigate('/home');
          }
        } catch (error) {
          console.error('Error saving session:', error);
          if (window.opener) {
            window.opener.location.href = '/login';
            window.close();
          } else {
            navigate('/login');
          }
        }
      } else if (metaAccessToken) {
        try {
          const response = await saveMetaSessionToDatabase(metaAccessToken);
          console.log('AuthCallback: User data from saveMetaSessionToDatabase:', response);
          if (response.user) {
            dispatch(setTokens({ accessToken: metaAccessToken, refreshToken: '' }));
            dispatch(setUser({ user: response.user, profileImage: response.user.picture }));
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log('User email:', response.user.email); // Log the user's email
          } else {
            console.error('Error saving session: User data is undefined');
          }
          setSession(metaAccessToken, ''); // Store tokens in local storage
          if (window.opener) {
            window.opener.location.href = '/home';
            window.close();
          } else {
            navigate('/home');
          }
        } catch (error) {
          console.error('Error saving session:', error);
          if (window.opener) {
            window.opener.location.href = '/login';
            window.close();
          } else {
            navigate('/login');
          }
        }
      } else if (facebookAccessToken) {
        try {
          const response = await saveFacebookSessionToDatabase(facebookAccessToken);
          console.log('AuthCallback: User data from saveFacebookSessionToDatabase:', response);
          if (response.user) {
            dispatch(setTokens({ accessToken: facebookAccessToken, refreshToken: '' }));
            dispatch(setUser({ user: response.user, profileImage: response.user.picture }));
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log('User email:', response.user.email); // Log the user's email
          } else {
            console.error('Error saving session: User data is undefined');
          }
          setSession(facebookAccessToken, ''); // Store tokens in local storage
          if (window.opener) {
            window.opener.location.href = '/home';
            window.close();
          } else {
            navigate('/home');
          }
        } catch (error) {
          console.error('Error saving session:', error);
          if (window.opener) {
            window.opener.location.href = '/login';
            window.close();
          } else {
            navigate('/login');
          }
        }
      } else {
        console.error('No access token or refresh token found');
        if (window.opener) {
          window.opener.location.href = '/login';
          window.close();
        } else {
          navigate('/login');
        }
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
