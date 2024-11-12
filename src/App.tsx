import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { setUser, setTokens } from './store/authSlice';
import { getSessionFromLocalStorage, saveGoogleSessionToDatabase } from './services/authService';
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
import AuthCallback from './pages/AuthCallback';

const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      console.log('Iniciando checkSession');

      const session = getSessionFromLocalStorage();
      if (session) {
        const { access_token, refresh_token } = session;
        dispatch(setTokens({ accessToken: access_token, refreshToken: refresh_token }));
        try {
          const user = await saveGoogleSessionToDatabase(access_token, refresh_token);
          dispatch(setUser({ user, profileImage: user.picture }));
        } catch (error) {
          console.error('Erro ao salvar sessão no banco de dados:', error);
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
        path="/home"
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
      <Route path="/auth-callback" element={<AuthCallback />} />
    </Routes>
  );
};

export default App;
