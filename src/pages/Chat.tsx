import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './styles/Chat.css';
import AccountPopup from '../components/AccountPopup';
import Browser from '../components/Browser';
import AccountSidebar from '../components/AccountSidebar';
import ChatInput from '../components/ChatInput';
import ChatHeader from '../components/ChatHeader';
import { useChatFunctions } from '../components/ChatFunctions';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function SafeMarkdown({ content }: { content: any }) {
  const safeContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  return <ReactMarkdown>{safeContent}</ReactMarkdown>;
}

function MessageDropdown({ message }: { message: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const displayText = message.role === 'user' ? 'REQUISIÇÃO FEITA' : 'REQUISIÇÃO SUGERIDA';

  return (
    <div className="message-dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {displayText}
      </div>
      {isOpen && (
        <div className="dropdown-content">
          <SafeMarkdown content={message.content} />
        </div>
      )}
    </div>
  );
}

const Chat: React.FC = () => {
  const [showPopup] = useState(false); // Remove setShowPopup
  const {
    selectedAccount,
    googleAccounts,
    facebookAccounts,
    activeCustomers,
    loadingGoogleAccounts,
    loadingFacebookAccounts,
    threads,
    selectedThread,
    messages,
    showCommentInput,
    comment,
    isTyping,
    browserUrl,
    setComment,
    handleFacebookLogin,
    handleAccountClick,
    handleThreadClick,
    sendFirstMessage,
    handleSendMessage,
    handleAddComment,
    handleCommentSubmit,
    adjustTextareaHeight,
    setSelectedThread,
    setMessages,
    setBrowserUrl,
  } = useChatFunctions();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.removeItem('messages'); // Clear messages from localStorage on page load

    const navButtons = document.querySelectorAll('.nav-btn');
    const chatContent = document.getElementById('chatContent');
    const browserContent = document.getElementById('browserContent');

    if (navButtons && chatContent && browserContent) {
      navButtons.forEach(button => {
        button.addEventListener('click', () => {
          const buttonText = button.querySelector('span')?.textContent?.trim();
          
          navButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          if (buttonText === 'Navegador') {
            (chatContent as HTMLElement).classList.remove('active');
            (browserContent as HTMLElement).classList.add('active');
            setBrowserUrl('https://www.google.com');
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
            setBrowserUrl('https://www.google.com');
          }
        });
      });
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('isTyping', JSON.stringify(isTyping));
  }, [isTyping]);

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
      <AccountSidebar
        selectedAccount={selectedAccount}
        setSelectedAccount={handleAccountClick}
        activeCustomers={activeCustomers}
      />
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
        <ChatHeader onInitChat={handleInitChat} />
        <div className="chat-history">
          {threads
            .sort((a, b) => a.created_at - b.created_at)
            .map((thread, index) => (
              <div key={index} className="chat-group">
                <div className="chat-group-title">{new Date(thread.created_at * 1000).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                <div className="chat-item" onClick={() => handleThreadClick(thread)}>
                  <span>{thread.metadata ? thread?.metadata?.last_message : 'init message'}...</span>
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
                Array.isArray(messages) && messages.length > 0 && messages.sort((a, b) => a.created_at - b.created_at).map((message) => (
                  <div key={message.id} className={`message-box ${message.role}`}>
                    {(message.content.startsWith('API response received') || message.content.startsWith('```json')) ? (
                      <MessageDropdown message={message} />
                    ) : (
                      <SafeMarkdown content={message.content} />
                    )}
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
                  <button className="welcome-button" onClick={() => sendFirstMessage('Quero informações sobre minhas campanhas')}>Informações</button>
                  <button className="welcome-button" onClick={() => sendFirstMessage('Quero criar uma campanha')}>Criar Campanhas</button>
                  <button className="welcome-button" onClick={() => sendFirstMessage('Quero otimizar minhas campanhas')}>Otimizar Campanhas</button>
                  </div>
                </div>
                )}
              {isTyping && (
                <div className="message-box assistant typing">
                  <div className="typing-indicator">
                    <DotLottieReact
                      src="https://lottie.host/818fa9d2-a249-4790-a71a-88762b83001f/ONEzhcNpiD.lottie"
                      loop
                      autoplay
                      style={{ width: '48px', height: '48px' }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
        <div id="browserContent" className="content-section">
          <Browser initialUrl={browserUrl} />
        </div>
      </main>

      {showPopup && (
        <AccountPopup
          googleAccounts={googleAccounts}
          facebookAccounts={facebookAccounts}
          handleAccountClick={handleAccountClick}
          handleFacebookLogin={handleFacebookLogin}
          loadingGoogleAccounts={loadingGoogleAccounts}
          loadingFacebookAccounts={loadingFacebookAccounts}
        />
      )}
    </div>
  );
};

export default Chat;
