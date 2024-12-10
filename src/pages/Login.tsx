import './styles/Login.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setTokens } from '../store/authSlice';
import { linkMetaAds, setSession, createPagePost } from '../services/api'; // Import createPagePost
import easyAdsImage from '../assets/easy.jpg'; // Correct image import

  const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

  const handleFacebookLogin = () => {
    console.log('Iniciando login com Facebook...');
    const popup = window.open(
      '',
      'facebook-login',
      'width=600,height=400'
    );

    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>Facebook Login</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: Arial, sans-serif;
                background-color: #f0f2f5;
                margin: 0;
              }
              .login-container {
                text-align: center;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .login-container h1 {
                font-size: 24px;
                margin-bottom: 20px;
              }
              .login-container button {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                background-color: #3b5998;
                color: white;
                font-size: 16px;
                cursor: pointer;
              }
              .login-container button:hover {
                background-color: #2d4373;
              }
            </style>
          </head>
          <body>
            <div class="login-container">
              <h1>Facebook Login</h1>
              <button onclick="window.opener.postMessage({ accessToken: 'fakeAccessToken', user: { id: 'fakeUserId', name: 'Fake User', picture: { data: { url: 'https://via.placeholder.com/150' } } }, type: 'facebook-login', appState: {} }, window.location.origin); window.close();">Login with Facebook</button>
            </div>
          </body>
        </html>
      `);

      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          console.log('Popup fechado pelo usuário.');
          navigate('/home');
        }
      }, 1000);
    }
  };

  const handleCreatePagePost = async () => {
    const pageId = 'mockPageId'; // Replace with actual page ID
    const postData = { message: 'Hello, world!' }; // Replace with actual post data
    const accessToken = 'mockAccessToken'; // Replace with actual access token
    const response = await createPagePost(pageId, postData, accessToken);
    console.log('Created page post:', response);
    alert('Mock post created successfully!');
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
            const hasCompletedRegistration = localStorage.getItem('hasCompletedRegistration');
            if (hasCompletedRegistration) {
              navigate('/home');
            } else {
              navigate('/complete-registration');
            }
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
        <button className="facebook-login-btn" onClick={handleFacebookLogin}>
          <i className="fab fa-facebook"></i> Login com Facebook
        </button>
      </div>
    </div>
  );
  };

export default Login;
