document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (localStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Gerenciamento do modal de contas
    const addAccountBtn = document.querySelector('.add-account-btn');
    const accountModal = document.getElementById('accountModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const platformButtons = document.querySelectorAll('.platform-btn');

    if (addAccountBtn && accountModal && closeModalBtn) {
        // Abrir modal
        addAccountBtn.addEventListener('click', () => {
            console.log('Botão de adicionar conta clicado');
            accountModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Fechar modal
        function closeModal() {
            console.log('Fechando modal');
            accountModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeModalBtn.addEventListener('click', closeModal);

        // Fechar modal ao clicar fora
        accountModal.addEventListener('click', (e) => {
            if (e.target === accountModal) {
                closeModal();
            }
        });

        // Vincular conta de plataforma
        platformButtons.forEach(button => {
            button.addEventListener('click', () => {
                const platform = button.querySelector('.platform-name').textContent;
                console.log(`Vinculando conta ${platform}...`);
                
                // Aqui você implementará a vinculação com cada plataforma
                setTimeout(() => {
                    closeModal();
                    // Adicionar nova conta à lista (implementar depois)
                }, 1000);
            });
        });
    } else {
        console.error('Elementos do modal não encontrados:', {
            addAccountBtn: !!addAccountBtn,
            accountModal: !!accountModal,
            closeModalBtn: !!closeModalBtn
        });
    }

    // URLs das plataformas de anúncios
    const platformUrls = {
        'Meta Ads': 'https://business.facebook.com',
        'Google Ads': 'https://ads.google.com',
        'TikTok Ads': 'https://ads.tiktok.com'
    };

    // Navegação entre conteúdos
    const navButtons = document.querySelectorAll('.nav-btn');
    const chatContent = document.getElementById('chatContent');
    const browserContent = document.getElementById('browserContent');
    const webviewContainer = document.querySelector('.webview-container');

    if (navButtons && chatContent && browserContent && webviewContainer) {
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const buttonText = button.querySelector('span').textContent.trim();
                
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                if (buttonText === 'Navegador') {
                    chatContent.classList.remove('active');
                    browserContent.classList.add('active');
                    // Carrega a URL da conta atualmente selecionada
                    const activeAccount = document.querySelector('.account-item.active');
                    if (activeAccount) {
                        const platform = activeAccount.querySelector('.account-label').textContent.trim();
                        loadWebview(platformUrls[platform]);
                    }
                } else if (buttonText === 'Chat') {
                    browserContent.classList.remove('active');
                    chatContent.classList.add('active');
                }
            });
        });
    } else {
        console.error('Elementos de navegação não encontrados:', {
            navButtons: !!navButtons,
            chatContent: !!chatContent,
            browserContent: !!browserContent,
            webviewContainer: !!webviewContainer
        });
    }

    // Gerenciamento de contas
    const accountItems = document.querySelectorAll('.account-item');
    if (accountItems) {
        accountItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active de todas as contas
                accountItems.forEach(acc => acc.classList.remove('active'));
                // Adiciona active na conta clicada
                item.classList.add('active');

                // Se o navegador estiver ativo, carrega a URL da nova conta
                if (browserContent.classList.contains('active')) {
                    const platform = item.querySelector('.account-label').textContent.trim();
                    loadWebview(platformUrls[platform]);
                }
            });
        });
    } else {
        console.error('Elementos de contas não encontrados:', {
            accountItems: !!accountItems
        });
    }

    function loadWebview(url) {
        if (!url) return;
        webviewContainer.innerHTML = '';
        const webview = document.createElement('iframe');
        webview.style.width = '100%';
        webview.style.height = '100%';
        webview.style.border = 'none';
        webview.src = url;
        webviewContainer.appendChild(webview);
    }

    // Menu de usuário
    const menuButton = document.querySelector('.menu-button');
    const userMenuTooltip = document.querySelector('.user-menu-tooltip');

    if (menuButton && userMenuTooltip) {
        menuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuTooltip.style.display = userMenuTooltip.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function(e) {
            if (!userMenuTooltip.contains(e.target) && !menuButton.contains(e.target)) {
                userMenuTooltip.style.display = 'none';
            }
        });

        const tooltipItems = document.querySelectorAll('.tooltip-item');
        if (tooltipItems) {
            tooltipItems.forEach(item => {
                item.addEventListener('click', function() {
                    const action = this.querySelector('span').textContent;
                    console.log(`Ação selecionada: ${action}`);
                    userMenuTooltip.style.display = 'none';

                    // Adicionar logout
                    if (action === 'Sair') {
                        // Limpar o estado de autenticação
                        localStorage.removeItem('isAuthenticated');
                        // Redirecionar para a página de login
                        window.location.href = 'login.html';
                    }
                });
            });
        } else {
            console.error('Elementos de menu não encontrados:', {
                tooltipItems: !!tooltipItems
            });
        }
    } else {
        console.error('Elementos de menu não encontrados:', {
            menuButton: !!menuButton,
            userMenuTooltip: !!userMenuTooltip
        });
    }

    // Auto-resize do textarea
    const textarea = document.querySelector('textarea');
    
    if (textarea) {
        function adjustTextareaHeight() {
            // Reseta a altura para recalcular
            textarea.style.height = '40px';
            
            // Verifica se o conteúdo excede uma linha
            if (textarea.scrollHeight > 40) {
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 24 * 6) + 'px';
                textarea.style.overflowY = 'auto';
            } else {
                textarea.style.overflowY = 'hidden';
            }
        }

        textarea.addEventListener('input', adjustTextareaHeight);
        
        // Ajustar altura inicial
        adjustTextareaHeight();
    } else {
        console.error('Elemento textarea não encontrado:', {
            textarea: !!textarea
        });
    }

    // Enviar mensagem
    const sendButton = document.querySelector('.send-button');
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            const message = textarea.value.trim();
            if (message) {
                console.log('Mensagem enviada:', message);
                textarea.value = '';
                adjustTextareaHeight();
            }
        });
    } else {
        console.error('Elemento sendButton não encontrado:', {
            sendButton: !!sendButton
        });
    }

    // Tecla Enter para enviar (Shift + Enter para nova linha)
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButton.click();
            }
        });
    } else {
        console.error('Elemento textarea não encontrado:', {
            textarea: !!textarea
        });
    }

    // Função de Tela Cheia
    function toggleFullScreen() {
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const expandIcon = fullscreenBtn.querySelector('i');
        
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
            expandIcon.classList.remove('fa-expand');
            expandIcon.classList.add('fa-compress');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
            expandIcon.classList.remove('fa-compress');
            expandIcon.classList.add('fa-expand');
        }
    }

    // Adicionar evento de clique no botão de tela cheia
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullScreen);
    }
});
