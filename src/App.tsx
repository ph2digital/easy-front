import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import { setUser, setGoogleTokens, setMetaTokens, selectIsAuthenticated, validateToken } from './store/authSlice';
import { getSessionFromLocalStorage } from './services/api';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
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
import Chat from './pages/Chat'; // Corrija o caminho do módulo
import ErrorBoundary from './components/ErrorBoundary';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = getSessionFromLocalStorage() as { google: any; meta: any; user: any; appState?: any } | null;
      if (session) {
        const { google, meta, user, appState } = session;
        dispatch(setGoogleTokens({ accessToken: google.access_token, refreshToken: google.refresh_token }));
        dispatch(setMetaTokens({ accessToken: meta.access_token, refreshToken: meta.refresh_token }));
        if (user && user !== 'undefined') {
          const profileImage = user.picture?.data?.url || user.picture || '';
          dispatch(setUser({ user, profileImage }));
        }
        if (appState) {
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
      if (session) {
        const { google, meta } = session;
        try {
          if (google.access_token) {
            await dispatch<any>(validateToken(google.access_token));
          }
          if (meta.access_token) {
            await dispatch<any>(validateToken(meta.access_token));
          }
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
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
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
            path="/chat"
            element={
              <PrivateRoute>
                <ErrorBoundary>
                  <Chat />
                </ErrorBoundary>
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
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
