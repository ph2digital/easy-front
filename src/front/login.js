document.addEventListener('DOMContentLoaded', function() {
    const loginOptions = document.querySelector('.login-options');
    const signupForm = document.querySelector('.signup-form');
    const signupBtn = document.querySelector('.email-signup .signup-btn');
    const backToLoginBtn = document.querySelector('.back-to-login');

    // Alternar entre login e cadastro
    signupBtn.addEventListener('click', () => {
        loginOptions.style.display = 'none';
        signupForm.classList.add('active');
    });

    backToLoginBtn.addEventListener('click', () => {
        loginOptions.style.display = 'block';
        signupForm.classList.remove('active');
    });

    // Autenticação com plataformas
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const platform = e.currentTarget.classList.contains('google') ? 'Google' : 'Facebook';
            authenticateWithPlatform(platform);
        });
    });

    // Envio do formulário de cadastro
    const createAccountBtn = signupForm.querySelector('.signup-btn');
    createAccountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const captcha = document.getElementById('captcha').checked;

        if (!name || !email || !password || !confirmPassword) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        if (!captcha) {
            alert('Por favor, confirme que você não é um robô');
            return;
        }

        // Aqui você implementará a criação da conta
        console.log('Criando conta...', { name, email });
        
        // Simular sucesso
        setTimeout(() => {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userName', name);
            window.location.href = 'index.html';
        }, 1000);
    });

    function authenticateWithPlatform(platform) {
        console.log(`Autenticando com ${platform}...`);
        
        // Simular autenticação bem-sucedida
        setTimeout(() => {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('platform', platform);
            window.location.href = 'index.html';
        }, 1000);
    }

    // Verificar se já está autenticado
    if (localStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = 'index.html';
    }
});
