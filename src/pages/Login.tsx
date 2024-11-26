import './styles/Login.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setTokens } from '../store/authSlice';
import { signInWithGoogle, linkMetaAds,setSession } from '../services/api'; // Ensure this path is correct
import easyAdsImage from '../assets/easy.jpg'; // Correct image import

  const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

  const handleFacebookLogin = () => {
    console.log('Iniciando login com Facebook...');
    linkMetaAds();
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
            dispatch(setUser({ user, profileImage: user.picture.data.url }));
            console.log('Chamando setSession com:', accessToken, '', user);
            setSession(accessToken, '', user, event.data.appState);
            // Use navigate instead of window.location.href to avoid full page reload
            navigate('/home');
          } else {
            console.error('Falha no login com Facebook:', event.data);
            alert('Falha no login com Facebook.');
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [dispatch, navigate]);

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
