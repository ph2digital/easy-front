import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { setUser, setTokens, selectIsAuthenticated, validateToken } from './store/authSlice';
import { getSessionFromLocalStorage } from './services/api';
import Home from './pages/Home';
import Login from './pages/Login';
import Campaigns from './pages/Campaigns';
import Gallery from './pages/Gallery';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import PrivateRoute from './PrivateRoute';
import Accounts from './pages/Accounts';
import AuthCallback from './pages/AuthCallback';
import CampaignDetails from './pages/CampaignDetails';
import CampaignCreation from './pages/CampaignCreation';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = getSessionFromLocalStorage();
      if (session) {
        const { access_token, refresh_token } = session;
        dispatch(setTokens({ accessToken: access_token, refreshToken: refresh_token }));
        const user = localStorage.getItem('user');
        if (user && user !== 'undefined') {
          dispatch(setUser({ user: JSON.parse(user), profileImage: JSON.parse(user).picture }));
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, [dispatch]);

  useEffect(() => {
    const validateUserToken = async () => {
      const session = getSessionFromLocalStorage();
      if (session) {
        const { access_token } = session;
        try {
          await dispatch<any>(validateToken(access_token));
        } catch (error) {
          console.error('Token validation failed:', error);
        }
      }
    };

    if (!isLoading && isAuthenticated) {
      validateUserToken();
    }
  }, [location, isLoading, isAuthenticated, dispatch]);

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
        path="/gallery"
        element={
          <PrivateRoute>
            <Gallery />
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
        path="/accounts"
        element={
          <PrivateRoute>
            <Accounts />
          </PrivateRoute>
        }
      />
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route
        path="/campaign-details/:id"
        element={
          <PrivateRoute>
            <CampaignDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-campaign"
        element={
          <PrivateRoute>
            <CampaignCreation />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;







