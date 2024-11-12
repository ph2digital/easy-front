import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { setUser, setTokens } from './store/authSlice';
import supabase from './services/supabaseClient';
import { saveGoogleSessionToDatabase } from './services/authService'; // importação da nova função
import Home from './pages/Home';
import Login from './pages/Login';
import Campaigns from './pages/Campaigns';
import Reports from './pages/Reports';
import Gallery from './pages/Gallery';
import Tips from './pages/Tips';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NewProject from './pages/NewProject';
import PrivateRoute from './PrivateRoute';
import Accounts from './pages/Accounts';

const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      console.log('Iniciando checkSession');

      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.slice(1));
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');

      if (accessToken && refreshToken) {
        console.log('Tokens encontrados, configurando sessão');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Erro ao configurar sessão:', error.message);
        } else {
          dispatch(setTokens({ accessToken, refreshToken }));
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            dispatch(
              setUser({
                user: sessionData.session.user,
                profileImage: sessionData.session.user.user_metadata.avatar_url,
              })
            );
            // Salva a sessão no banco de dados
            await saveGoogleSessionToDatabase(sessionData.session);
          }
        }
      }

      setIsLoading(false);
    };

    checkSession();
  }, [dispatch]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/campaigns"
        element={
          <PrivateRoute>
            <Campaigns />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />
      <Route
        path="/gallery"
        element={
          <PrivateRoute>
            <Gallery />
          </PrivateRoute>
        }
      />
      <Route
        path="/tips"
        element={
          <PrivateRoute>
            <Tips />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-project"
        element={
          <PrivateRoute>
            <NewProject />
          </PrivateRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <PrivateRoute>
            <Accounts />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
