import './styles/Login.css';
import { signInWithGoogle, linkMetaAds } from '../services/authService'; // Ensure this path is correct
import easyAdsImage from '../assets/easy.jpg'; // Correct image import

const Login = () => {
  const handleFacebookLogin = () => {
    linkMetaAds(false);
  };

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
