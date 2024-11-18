import './styles/Login.css';
import { signInWithGoogle } from '../services/authService';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-image">
        {/* Área para uma imagem de marketing genérica */}
        <img src="/path/to/marketing-image.jpg" alt="Marketing" />
      </div>
      <div className="login-content">
        <h1 className="app-title">Bem-vindo ao EasyAds</h1>
        <p className="app-description">
          Sua plataforma para campanhas de marketing eficazes e resultados incríveis.
        </p>
        <button className="google-login-btn" onClick={signInWithGoogle}>
          <i className="fab fa-google"></i> Login com Google
        </button>
      </div>
    </div>
  );
};

export default Login;
