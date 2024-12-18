import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './styles/Chat.css';
import AccountPopup from '../components/AccountPopup';
import { RootState } from '../store';
import { linkMetaAds, linkAccountFromHome, getSessionFromLocalStorage, fetchFacebookAdAccounts, fetchThreads, fetchMessages, getGPTResponse, createThread, submitComment } from '../services/api';

const Chat: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(localStorage.getItem('selectedAccount'));
  const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);
  const [facebookAccounts, setFacebookAccounts] = useState<any[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<any[]>([]);
  const [loadingGoogleAccounts, setLoadingGoogleAccounts] = useState(true);
  const [loadingFacebookAccounts, setLoadingFacebookAccounts] = useState(true);
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any | null>(localStorage.getItem('selectedThread'));
  const [messages, setMessages] = useState<any[]>([]);
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const accessTokenGoogle = useSelector((state: RootState) => state.auth.googleAccessToken);

  useEffect(() => {
    console.log('Loading active customers from localStorage');
    const storedActiveCustomers = JSON.parse(localStorage.getItem('activeCustomers') || '[]');
    setActiveCustomers(storedActiveCustomers);

    const storedSelectedCustomer = localStorage.getItem('selectedCustomer');
    if (storedSelectedCustomer) {
      setSelectedAccount(storedSelectedCustomer);
    } else if (storedActiveCustomers.length > 0) {
      setSelectedAccount(storedActiveCustomers[0].customer_id);
    } else {
      setShowPopup(true);
    }
  }, []);

  useEffect(() => {
    console.log('Loading Google and Facebook accounts from localStorage');
    const storedGoogleAccounts = JSON.parse(localStorage.getItem('googleAccounts') || '[]');
    const storedFacebookAccounts = JSON.parse(localStorage.getItem('facebookAccounts') || '[]');
    setGoogleAccounts(storedGoogleAccounts);
    setFacebookAccounts(storedFacebookAccounts);
    setLoadingGoogleAccounts(false);
    setLoadingFacebookAccounts(false);
  }, []);

  useEffect(() => {
    const loadThreads = async () => {
      const session = getSessionFromLocalStorage();
      const userId = session?.user?.id;
      if (userId) {
        const fetchedThreads = await fetchThreads(userId);
        setThreads(fetchedThreads);
        if (!selectedThread && fetchedThreads.length > 0) {
          setSelectedThread(fetchedThreads[0]);
          localStorage.setItem('selectedThread', fetchedThreads[0].id);
        }
      }
    };
    loadThreads();
  }, [selectedAccount]);

  const handleFacebookLogin = async () => {
    console.log('Handling Facebook login');
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;

    const newWindow = linkMetaAds(userId);

    const checkWindowClosed = setInterval(() => {
      if (newWindow && newWindow.closed) {
        clearInterval(checkWindowClosed);
        window.location.reload();
      }
    }, 500);
  };

  const handleLinkAccount = async (platform: string) => {
    console.log('Linking account for platform:', platform);
    try {
      const session = getSessionFromLocalStorage();
      const userId = session?.user?.id;

      if (!userId) {
        throw new Error('User ID não encontrado na sessão');
      }

      const authUrl = await linkAccountFromHome(platform, userId);

      if (accessTokenGoogle && userId) {
        try {
          const facebookAdAccounts = await fetchFacebookAdAccounts(accessTokenGoogle, userId);
          setFacebookAccounts(facebookAdAccounts.adAccounts);
          localStorage.setItem('facebookAccounts', JSON.stringify(facebookAdAccounts.adAccounts));
        } catch (error) {
          console.error('Error fetching Facebook Ad accounts:', error);
        }
      }
      window.location.href = authUrl;

    } catch (error) {
      console.error('Error linking account:', error);
    }
  };

  const handleAccountClick = async (accountId: string) => {
    console.log('Account clicked:', accountId);
    setSelectedAccount(accountId);
  };

  const handleThreadClick = async (thread: any) => {
    console.log('Thread clicked:', thread);
    setSelectedThread(thread);
    localStorage.setItem('selectedThread', thread.id);
    const fetchedMessages = await fetchMessages(thread.id);
    const formattedMessages = fetchedMessages.map((msg: any) => ({
      ...msg,
      content: msg.content.map((c: any) => c.text.value).join(' ')
    }));
    setMessages(formattedMessages);
  };

  const handleCreateThread = () => {
    const initialMessage = {
      id: `temp-${Date.now()}`,
      role: 'system',
      content: `
        <p>Bem-vindo! Como posso ajudar você hoje?</p>
        <button onclick="handleOptionClick('info')">Informações</button>
        <button onclick="handleOptionClick('create')">Criar Campanhas</button>
        <button onclick="handleOptionClick('optimize')">Otimizar Campanhas</button>
      `
    };
    setMessages([initialMessage]);
    setSelectedThread(null);
    localStorage.removeItem('selectedThread');
  };

  const handleOptionClick = async (option: string) => {
    const messageContent = `${option}`;
    if (!selectedThread) {
      const session = getSessionFromLocalStorage();
      const userId = session?.user?.id;
      if (userId) {
        const newThread = await createThread(userId, messageContent);
        setThreads((prevThreads) => [...prevThreads, newThread]);
        setSelectedThread(newThread);
        localStorage.setItem('selectedThread', newThread.id);
      }
    }
    handleSendMessage(messageContent);
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!selectedThread) {
      handleOptionClick(messageContent);
      return;
    }

    const newMessage = { id: `temp-${Date.now()}`, role: 'user', content: messageContent };
    setMessages([...messages, newMessage]);
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    try {
      await getGPTResponse(messageContent, userId, selectedThread.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAddComment = (messageId: string) => {
    setShowCommentInput(messageId);
  };

  const handleCommentSubmit = async (messageId: string) => {
    if (comment.trim()) {
      try {
        const session = getSessionFromLocalStorage();
        const userId = session?.user?.id;
        await submitComment(userId, messageId, comment);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const messageIndex = newMessages.findIndex((msg) => msg.id === messageId);
          if (messageIndex !== -1) {
            newMessages[messageIndex].content += `<br/><strong>Comment:</strong> ${comment}`;
          }
          return newMessages;
        });
        setComment('');
        setShowCommentInput(null);
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = '40px'; // Reset height to calculate new height
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 144; // 6 lines * 24px per line
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const chatContent = document.getElementById('chatContent');
    const browserContent = document.getElementById('browserContent');
    const webviewContainer = document.querySelector('.webview-container');

    if (navButtons && chatContent && browserContent && webviewContainer) {
      navButtons.forEach(button => {
        button.addEventListener('click', () => {
          const buttonText = button.querySelector('span')?.textContent?.trim();
          
          navButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          if (buttonText === 'Navegador') {
            (chatContent as HTMLElement).classList.remove('active');
            (browserContent as HTMLElement).classList.add('active');
            // Carrega a URL do Google Ads
            loadWebview('https://ads.google.com');
          } else if (buttonText === 'Chat') {
            (browserContent as HTMLElement).classList.remove('active');
            (chatContent as HTMLElement).classList.add('active');
          }
        });
      });
    }

    const accountItems = document.querySelectorAll('.account-item');
    if (accountItems) {
      accountItems.forEach(item => {
        item.addEventListener('click', () => {
          accountItems.forEach(acc => acc.classList.remove('active'));
          item.classList.add('active');

          if (browserContent?.classList.contains('active')) {
            loadWebview('https://ads.google.com');
          }
        });
      });
    }

    function loadWebview(url: string) {
      if (!url || !webviewContainer) return;
      webviewContainer.innerHTML = '';
      const webview = document.createElement('iframe');
      webview.style.width = '100%';
      webview.style.height = '100%';
      webview.style.border = 'none';
      webview.src = url;
      webviewContainer.appendChild(webview);
    }

    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', toggleFullScreen);
    }

    function toggleFullScreen() {
      const expandIcon = fullscreenBtn?.querySelector('i');
      
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }
        expandIcon?.classList.remove('fa-expand');
        expandIcon?.classList.add('fa-compress');
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        expandIcon?.classList.remove('fa-compress');
        expandIcon?.classList.add('fa-expand');
      }
    }

    const menuButton = document.querySelector('.menu-button');
    const userMenuTooltip = document.querySelector('.user-menu-tooltip');

    if (menuButton && userMenuTooltip) {
      menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        (userMenuTooltip as HTMLElement).style.display = (userMenuTooltip as HTMLElement).style.display === 'block' ? 'none' : 'block';
      });

      document.addEventListener('click', (e) => {
        if (!userMenuTooltip.contains(e.target as Node) && !menuButton.contains(e.target as Node)) {
          (userMenuTooltip as HTMLElement).style.display = 'none';
        }
      });
    }

    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.addEventListener('input', () => adjustTextareaHeight(textarea as HTMLTextAreaElement));
      adjustTextareaHeight(textarea as HTMLTextAreaElement); // Initial adjustment
    }
  }, []);

  const handleInitChat = () => {
    setSelectedThread(null);
    setMessages([]);
    localStorage.removeItem('selectedThread');
  };

  return (
    <div className="app">
      <button id="fullscreen-btn" className="fullscreen-toggle">
        <i className="fullscreen-icon"></i>
        <span className="tooltip">Expandir tela cheia</span>
      </button>
      <div className="account-switcher">
        <div className="account-item active">
          <div className="account-avatar">CC#2</div>
        </div>
        <div className="account-item">
          <div className="account-avatar">CC#5</div>
        </div>
        <div className="account-add">
          <button className="add-account-btn">
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div className="vertical-separator"></div>
      <nav className="sidebar">
        <div className="user-section">
          <div className="user-profile-header">
            <img src="https://via.placeholder.com/40" alt="User Profile" />
            <button className="menu-button">
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div className="user-menu-tooltip" style={{ display: 'none' }}>
            <div className="tooltip-item">
              <i className="fas fa-cog"></i>
              <span>Configurações</span>
            </div>
            <div className="tooltip-item">
              <i className="fas fa-credit-card"></i>
              <span>Pagamento</span>
            </div>
            <div className="tooltip-item">
              <i className="fas fa-sign-out-alt"></i>
              <span>Sair</span>
            </div>
          </div>
        </div>
        <div className="main-nav">
          <button className="nav-btn active">
            <span>Chat</span>
          </button>
          <button className="nav-btn active">
            <span>Requisições</span>
          </button>
          <button className="nav-btn">
            <span>Navegador</span>
          </button>
        </div>
        <button className="new-chat" onClick={handleInitChat}>
          <i className="fas fa-plus"></i>
          <span>Nova conversa</span>
        </button>
        <div className="chat-history">
          {threads
            .sort((a, b) => b.created_at - a.created_at)
            .map((thread, index) => (
              <div key={index} className="chat-group">
                <div className="chat-group-title">{new Date(thread.created_at * 1000).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                <div className="chat-item" onClick={() => handleThreadClick(thread)}>
                  <span>{thread.metadata ? JSON.stringify(thread.metadata) : 'init message'}</span>
                </div>
              </div>
          ))}
        </div>
      </nav>

      <main className="main-content">
        <div id="chatContent" className="content-section active">
          <div className="chat-container">
            <div className="messages-container">
              {selectedThread ? (
                messages.map((message) => (
                  <div key={message.id} className={`message-box ${message.role}`}>
                    <p dangerouslySetInnerHTML={{ __html: message.content }}></p>
                    <button className={`comment-button ${message.role === 'user' ? 'left' : 'right'}`} onClick={() => handleAddComment(message.id)}>
                      <i className="fas fa-reply"></i>
                    </button>
                    {showCommentInput === message.id && (
                      <div className="comment-input-container">
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Type a comment"
                        />
                        <button onClick={() => handleCommentSubmit(message.id)}>Submit</button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="welcome-screen">
                  <h1>Bem-vindo! Como posso ajudar você hoje?</h1>
                  <div className="welcome-buttons">
                    <button className="welcome-button" onClick={() => handleOptionClick('Quero informações sobre minhas campanhas')}>Informações</button>
                    <button className="welcome-button" onClick={() => handleOptionClick('Quero criar uma campanha')}>Criar Campanhas</button>
                    <button className="welcome-button" onClick={() => handleOptionClick('Quero otimizar minhas campanhas')}>Otimizar Campanhas</button>
                  </div>
                </div>
              )}
            </div>
            <div className="input-container">
              <div className="input-box">
                <textarea placeholder="Envie uma mensagem"></textarea>
  
              </div>
              <button className="send-button" onClick={() => handleSendMessage((document.querySelector('textarea') as HTMLTextAreaElement).value)}>
                  <i className="fas fa-paper-plane"></i>
                </button>
            </div>
          </div>
        </div>
        <div id="browserContent" className="content-section">
          <div className="webview-container">
            {/* Webviews will be added dynamically */}
          </div>
        </div>
      </main>

      {showPopup && (
        <AccountPopup
          googleAccounts={googleAccounts}
          facebookAccounts={facebookAccounts}
          handleAccountClick={handleAccountClick}
          handleLinkAccount={handleLinkAccount}
          handleFacebookLogin={handleFacebookLogin}
          setShowPopup={setShowPopup}
          loadingGoogleAccounts={loadingGoogleAccounts}
          loadingFacebookAccounts={loadingFacebookAccounts}
          activeCustomers={activeCustomers}
          toggleAccountStatus={() => {}}
        />
      )}
    </div>
  );
};

export default Chat;
