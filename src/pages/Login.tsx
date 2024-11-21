import './styles/Login.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setTokens } from '../store/authSlice';
import { signInWithGoogle, linkMetaAds } from '../services/api'; // Ensure this path is correct
import easyAdsImage from '../assets/easy.jpg'; // Correct image import

const Login = () => {
  const dispatch = useDispatch();

  const handleFacebookLogin = () => {
    console.log('Iniciando login com Facebook...');
    linkMetaAds(false);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Mensagem recebida:', event);
      if (event.origin !== window.location.origin) {
        const { accessToken, user, type } = event.data;
        if (type === 'facebook-login') {
          if (accessToken && user) {
            console.log('Login com Facebook bem-sucedido:', event.data);
            dispatch(setTokens({ accessToken, refreshToken: '' }));
            dispatch(setUser({ user, profileImage: user.picture }));
            window.location.href = '/';
          } else {
            console.error('Falha no login com Facebook:', event.data);
            alert('Falha no login com Facebook.');
          }
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [dispatch]);

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={easyAdsImage} alt="EasyAds" />
      </div>
      <div className="login-content">
        <h1 className="app-title">Bem-vindo ao EasyAds</h1>
        <p className="app-description">
          Sua plataforma para campanhas de marketing eficazes e resultados incríveis.
        </p>
        <button className="google-login-btn" onClick={signInWithGoogle}>
          <i className="fab fa-google"></i> Login com Google
        </button>
        <button className="facebook-login-btn" onClick={handleFacebookLogin}>
          <i className="fab fa-facebook"></i> Login com Facebook
        </button>
      </div>
    </div>
  );
};

export default Login;
