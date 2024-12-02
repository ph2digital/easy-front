import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import { setUser, setTokens, selectIsAuthenticated, validateToken } from './store/authSlice';
import { getSessionFromLocalStorage } from './services/api';
import Home from './pages/Home';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import PrivateRoute from './PrivateRoute';
import Accounts from './pages/Accounts';
import AuthCallback from './pages/AuthCallback';
import CampaignDetails from './pages/CampaignDetails';
import CampaignCreation from './pages/CampaignCreation';
import CustomAudienceCreation from './pages/CustomAudienceCreation';
import PrivacyPolicy from './pages/PrivacyPolicy';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = getSessionFromLocalStorage();
      console.log('checkSession - Session from localStorage:', session);
      if (session) {
        const { access_token, refresh_token, user, appState } = session;
        dispatch(setTokens({ accessToken: access_token, refreshToken: refresh_token }));
        console.log('checkSession - User from localStorage:', user);
        if (user && user !== 'undefined') {
          const profileImage = user.picture?.data?.url || user.picture || '';
          dispatch(setUser({ user, profileImage }));
        }
        if (appState) {
          console.log('checkSession - AppState from localStorage:', appState);
          // Restore other parts of the app state if needed
          // Example: dispatch(setAppState(appState));
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, [dispatch]);

  useEffect(() => {
    const validateUserToken = async () => {
      const session = getSessionFromLocalStorage();
      console.log('validateUserToken - Session from localStorage:', session);
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

  useEffect(() => {
    console.log('App - Location changed:', location);
  }, [location]);

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
      <Route
        path="/create-custom-audience"
        element={
          <PrivateRoute>
            <CustomAudienceCreation />
          </PrivateRoute>
        }
      />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
};


export default App;







