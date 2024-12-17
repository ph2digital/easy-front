// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setGoogleTokens, setMetaTokens, setUser } from '../store/authSlice';
import { saveGoogleSessionToDatabase, saveMetaSessionToDatabase, saveFacebookSessionToDatabase, setSession } from '../services/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const metaAccessToken = urlParams.get('meta_access_token');
      const facebookAccessToken = urlParams.get('facebook_access_token');

      if (accessToken && refreshToken) {
        try {
          const response = await saveGoogleSessionToDatabase(accessToken, refreshToken);
          if (response.user) {
            const profileImage = response.user.picture?.data?.url || response.user.picture || '';
            dispatch(setGoogleTokens({ accessToken, refreshToken }));
            dispatch(setUser({ user: response.user, profileImage }));
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            console.error('Error saving session: User data is undefined');
          }
          setSession(accessToken, refreshToken, '', '', response.user, {});
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
          const response = await saveMetaSessionToDatabase(metaAccessToken, '');
          if (response.user) {
            const profileImage = response.user.picture?.data?.url || response.user.picture || '';
            dispatch(setMetaTokens({ accessToken: metaAccessToken, refreshToken: '' }));
            dispatch(setUser({ user: response.user, profileImage }));
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            console.error('Error saving session: User data is undefined');
          }
          setSession('', '', metaAccessToken, '', response.user, {});
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
          if (response.user) {
            const profileImage = response.user.picture?.data?.url || response.user.picture || '';
            dispatch(setMetaTokens({ accessToken: facebookAccessToken, refreshToken: '' }));
            dispatch(setUser({ user: response.user, profileImage }));
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            console.error('Error saving session: User data is undefined');
          }
          setSession('', '', facebookAccessToken, '', response.user, {});
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
