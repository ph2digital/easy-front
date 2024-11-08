import { ReactNode, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from './store/store';
import { setUser } from './store/authSlice';
import supabase from './services/supabaseClient';

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
      try {
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData?.session) {
          // Caso contrário, tenta configurar a sessão a partir dos tokens do Local Storage
          const storedToken = localStorage.getItem('sb-wawkkvukaanyjzznaskk-auth-token');
          
          if (storedToken) {
            const parsedToken = JSON.parse(storedToken);
            const { access_token, refresh_token } = parsedToken;
            
            if (access_token && refresh_token) {
              const { error, data } = await supabase.auth.setSession({
                access_token,
                refresh_token,
              });

              if (error) {
                console.error('Erro ao restaurar sessão:', error.message);
              } else if (data.session) {
                // Armazena os dados do usuário no Redux
                dispatch(
                  setUser({
                    user: data.session.user,
                    profileImage: data.session.user.user_metadata?.avatar_url || '',
                  })
                );
              }
            }
          }
        } else {
          // Atualiza o Redux com a sessão existente
          dispatch(
            setUser({
              user: sessionData.session.user,
              profileImage: sessionData.session.user.user_metadata?.avatar_url || '',
            })
          );
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      }

      setIsLoading(false); // Conclui o carregamento após verificar a sessão
    };

    if (!user) {
      checkAuthFromStorage();
    } else {
      setIsLoading(false);
    }
  }, [user, dispatch]);

  // Exibe uma mensagem de carregamento enquanto verifica a sessão
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Redireciona para login se o usuário não estiver autenticado e não houver sessão
  if (!user && !localStorage.getItem('sb-wawkkvukaanyjzznaskk-auth-token')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
