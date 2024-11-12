import { ReactNode, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from './store/store';
import { setUser, setTokens } from './store/authSlice';
import { getSessionFromLocalStorage, saveGoogleSessionToDatabase } from './services/authService';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthFromStorage = async () => {
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

    if (!user) {
      checkAuthFromStorage();
    } else {
      setIsLoading(false);
    }
  }, [user, dispatch]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user && !localStorage.getItem('auth-token')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
