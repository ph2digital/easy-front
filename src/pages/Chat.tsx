import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './styles/Chat.css';
import AccountPopup from '../components/AccountPopup';
import AccountSidebar from '../components/AccountSidebar';
import ChatInput from '../components/ChatInput';
import ChatHeader from '../components/ChatHeader';
import { useChatFunctions } from '../components/ChatFunctions';
import ChatGPTAvatar from '../assets/Logo_branco.svg';
import UserAvatar from '../assets/user-avatar.svg';
import EasyAdLogo from '../assets/easy.ad_branco.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faChevronLeft, 
  faSearch 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faClone,
  faThumbsUp,
  faThumbsDown,
  faCircleCheck 
} from '@fortawesome/free-regular-svg-icons';

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

interface MessageFeedback {
  [key: string]: 'like' | 'dislike' | null;
}

const Chat: React.FC = () => {
  const [showPopup] = useState(false); 
  const [visibleThreads, setVisibleThreads] = useState(10);
  const [isOpen, setIsOpen] = useState(true); 
  const [activeTab, setActiveTab] = useState('chat');
  const [messageFeedback, setMessageFeedback] = useState<MessageFeedback>({});
  const [copiedMessages, setCopiedMessages] = useState<{[key: string]: boolean}>({});
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
    setComment,
    handleFacebookLogin,
    handleAccountClick,
    handleThreadClick,
    handleSendMessage,
    handleAddComment,
    handleCommentSubmit,
    adjustTextareaHeight,
    setSelectedThread,
    setMessages,
  } = useChatFunctions();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.removeItem('messages'); 

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
      adjustTextareaHeight(textarea as HTMLTextAreaElement); 
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

  useEffect(() => {
    console.log('Updating AccountSidebar with activeCustomers:', activeCustomers);
  }, [activeCustomers]);

  const handleInitChat = () => {
    setSelectedThread(null);
    setMessages([]);
    localStorage.removeItem('selectedThread');
  };

  const handleLoadMore = () => {
    setVisibleThreads((prev) => prev + 5);
  };

  const handleLikeFeedback = (messageId: string) => {
    setMessageFeedback(prev => ({
      ...prev,
      [messageId]: prev[messageId] === 'like' ? null : 'like'
    }));
  };

  const handleDislikeFeedback = (messageId: string) => {
    setMessageFeedback(prev => ({
      ...prev,
      [messageId]: prev[messageId] === 'dislike' ? null : 'dislike'
    }));
  };

  const handleCopyMessage = (messageId: string, messageContent: string) => {
    navigator.clipboard.writeText(messageContent)
      .then(() => {
        setCopiedMessages(prev => ({
          ...prev,
          [messageId]: true
        }));

        setTimeout(() => {
          setCopiedMessages(prev => ({
            ...prev,
            [messageId]: false
          }));
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy message: ', err);
      });
  };

  const formatThreadDate = (date: number) => {
    const threadDate = new Date(date * 1000);
    return threadDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app">
      <AccountSidebar
        selectedAccount={selectedAccount}
        setSelectedAccount={handleAccountClick}
        activeCustomers={activeCustomers}
      />
      {!isOpen && (
        <button 
          className="expand-sidebar-btn"
          onClick={() => setIsOpen(true)}
          title="Abrir barra lateral"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
      <nav className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
        <div className="user-section">
          <div className="user-profile-header">
            <button 
              className="collapse-btn"
              title="Recolher Sidebar"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button 
              className="search-threads-btn"
              title="Pesquisar Histórico de Threads"
              onClick={() => {
                console.log('Open thread search modal/functionality');
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
        <div className="main-nav">
          <div className="nav-buttons-container">
            <button 
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
              title="Chat Menu"
            >
              <span>Chat</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
              title="Requisições Menu"
            >
              <span>Requisições</span>
            </button>
          </div>
        </div>
        <ChatHeader onInitChat={handleInitChat} />
        <div className="chat-history">
          {threads && threads.length > 0 ? Object.entries(
            threads
              .sort((a, b) => b.created_at - a.created_at)
              .slice(0, visibleThreads)
              .reduce((groups: { [key: string]: any[] }, thread) => {
                const now = new Date();
                now.setHours(0, 0, 0, 0); 
                
                const threadDate = new Date(thread.created_at * 1000);
                threadDate.setHours(0, 0, 0, 0); 
                
                const diffTime = now.getTime() - threadDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                console.log('Thread date:', threadDate.toLocaleDateString(), 'Diff days:', diffDays);
                
                let groupTitle;
                if (diffDays === 0) {
                  groupTitle = 'Hoje';
                } else if (diffDays === 1) {
                  groupTitle = 'Ontem';
                } else if (diffDays <= 7) {
                  groupTitle = '7 dias atrás';
                } else if (diffDays <= 30) {
                  groupTitle = '30 dias atrás';
                } else {
                  return groups; 
                }

                if (!groups[groupTitle]) {
                  groups[groupTitle] = [];
                }
                groups[groupTitle].push({
                  ...thread,
                  formattedDate: new Date(thread.created_at * 1000).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                });
                return groups;
              }, {})
          ).map(([groupTitle, groupThreads]) => (
            <div key={groupTitle} className="chat-group">
              <div className="chat-group-title">{groupTitle}</div>
              {groupThreads.map((thread: any, _index: number) => (
                <div 
                  key={thread.id} 
                  className={`thread-item ${selectedThread?.id === thread.id ? 'selected' : ''}`}
                  onClick={() => handleThreadClick(thread)}
                >
                  <div className="thread-title">
                    {thread.title}
                  </div>
                  <div className="thread-date">
                    {formatThreadDate(thread.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )) : (
            <div className="no-threads">
              <span>Nenhuma conversa encontrada</span>
            </div>
          )}
          {threads && visibleThreads < threads.length && (
            <button className="load-more-button" onClick={handleLoadMore}>Ver Mais</button>
          )}
        </div>
      </nav>

      <main className="main-content">
        <div id="chatContent" className="content-section active">
          <div className="chat-container">
            <div className="messages-container">
                {selectedThread ? (
                Array.isArray(messages) && messages.length > 0 && messages.sort((a, b) => a.created_at - b.created_at).map((message, index) => (
                  <div 
                    key={index} 
                    className={`message-container ${message.role}`}
                  >
                    {message.role === 'assistant' && (
                      <img 
                        src={ChatGPTAvatar} 
                        alt="ChatGPT Avatar" 
                        className="message-avatar" 
                      />
                    )}
                    <div 
                      className={`message-box ${message.role}`}
                    >
                      {(message.content.startsWith('API response received') || message.content.startsWith('```json')) ? (
                        <MessageDropdown message={message} />
                      ) : (
                        <SafeMarkdown content={message.content} />
                      )}
                      {message.role === 'assistant' && (
                        <div className="message-feedback-buttons">
                          {(!messageFeedback[message.id] || messageFeedback[message.id] === 'like') && (
                            <button 
                              className={`feedback-btn like-btn ${messageFeedback[message.id] === 'like' ? 'active' : ''}`}
                              onClick={() => handleLikeFeedback(message.id)}
                            >
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </button>
                          )}
                          {(!messageFeedback[message.id] || messageFeedback[message.id] === 'dislike') && (
                            <button 
                              className={`feedback-btn dislike-btn ${messageFeedback[message.id] === 'dislike' ? 'active' : ''}`}
                              onClick={() => handleDislikeFeedback(message.id)}
                            >
                              <FontAwesomeIcon icon={faThumbsDown} />
                            </button>
                          )}
                          <button 
                            className="feedback-btn copy-btn"
                            onClick={() => handleCopyMessage(message.id, message.content)}
                          >
                            <FontAwesomeIcon 
                              icon={copiedMessages[message.id] ? faCircleCheck : faClone} 
                            />
                          </button>
                        </div>
                      )}
                      <button 
                        className={`comment-button ${message.role === 'user' ? 'left' : 'right'}`} 
                        onClick={() => handleAddComment(message.id)}
                        title="Adicionar comentário"
                      >
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
                    {message.role === 'user' && (
                      <img 
                        src={UserAvatar} 
                        alt="User Avatar" 
                        className="message-avatar" 
                      />
                    )}
                  </div>
                ))
                ) : (
                <div className="welcome-container">
                  <img src={EasyAdLogo} alt="Easy.ad Logo" className="welcome-logo" />
                  <h2>Olá! Vamos criar sua campanha de anúncios.</h2>
                  <p>Para começar, onde deseja anunciar? Você pode utilizar os atalhos de ações rápidas para agilizar o processo.</p>
                </div>
                )}
              {isTyping && (
                <div className="loading-container">
                  {/* <LoadingMessage /> */}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
          </div>
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
