import { ReactNode, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from './store/index';
import { validateToken } from './store/authSlice';
import { getSessionFromLocalStorage, clearSession } from './services/api';

interface PrivateRouteProps {
  children: ReactNode;
}

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'default-auth-token';

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthFromStorage = async () => {
      const session = getSessionFromLocalStorage();
      if (session) {
        const { access_token } = session;
        try {
          await dispatch<any>(validateToken(access_token)).unwrap();
        } catch (error) {
          clearSession();
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

  if (!user && !localStorage.getItem(STORAGE_KEY)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

