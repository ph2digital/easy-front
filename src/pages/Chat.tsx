import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import './styles/Chat.css';
import AccountPopup from '../components/AccountPopup';
import Browser from '../components/Browser';
import AccountSidebar from '../components/AccountSidebar';
import ChatInput from '../components/ChatInput';
import ChatHeader from '../components/ChatHeader';
import { linkMetaAds, getSessionFromLocalStorage, fetchThreads, fetchMessages, getGPTResponse, createThread, submitComment, validateAndRefreshGoogleToken } from '../services/api';

const Chat: React.FC = () => {
  const [showPopup] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(localStorage.getItem('selectedAccount'));
  const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);
  const [facebookAccounts, setFacebookAccounts] = useState<any[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<any[]>([]);
  const [loadingGoogleAccounts, setLoadingGoogleAccounts] = useState(true);
  const [loadingFacebookAccounts, setLoadingFacebookAccounts] = useState(true);
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [browserUrl, setBrowserUrl] = useState<string>('https://www.google.com');
  
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Loading active customers from localStorage');
    const storedActiveCustomers = JSON.parse(localStorage.getItem('activeCustomers') || '[]');
    setActiveCustomers(storedActiveCustomers);

    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    setSelectedAccount(userId);
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
        setSelectedAccount(userId);
        if (!selectedThread && fetchedThreads.length > 0) {
          // setSelectedThread(fetchedThreads[0]);
          // localStorage.setItem('selectedThread', fetchedThreads[0].id);
        }
      }
    };
    loadThreads();
  }, [selectedAccount]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (pollingInterval !== null && selectedThread) {
      setIsTyping(true);
      intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        if (selectedThread) {
          fetchMessagesForThread(selectedThread.id);
        }
      }, pollingInterval);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [pollingInterval, selectedThread]);

  useEffect(() => {
    if (elapsedTime <= 60) {
      setPollingInterval(1000); // 1 second
    } else if (elapsedTime <= 300) {
      setPollingInterval(10000); // 10 seconds
    } else {
      setPollingInterval(60000); // 60 seconds
    }
  }, [elapsedTime]);

  const fetchMessagesForThread = async (threadId: string) => {
    const fetchedMessages = await fetchMessages(threadId);
    const result = fetchedMessages?.result?.data;
    const formattedMessages = result
      .filter((msg: any) => !msg.metadata?.system)
      .map((msg: any) => ({
        ...msg,
        content: msg.content.map((c: any) => c.text.value).join(' ')
      })).sort((a: { created_at: number; role: string }, b: { created_at: number; role: string }) => {
        if (a.created_at === b.created_at) {
          return a.role === 'assistant' ? -1 : 1;
        }
        return a.created_at - b.created_at;
      });

    const currentMessageIds = messages.map((msg: any) => msg.id);
    const newMessageIds = formattedMessages.map((msg: any) => msg.id);

    if (JSON.stringify(currentMessageIds) !== JSON.stringify(newMessageIds)) {
      setMessages(formattedMessages);
      // Stop the polling loop
      setPollingInterval(null);
    }
  };

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


  const handleAccountClick = async (accountId: string) => {
    console.log('Account clicked:', accountId);
    setSelectedAccount(accountId);
  };

  const handleThreadClick = async (thread: any) => {
    console.log('Thread clicked:', thread);
    setSelectedThread(thread);
    localStorage.setItem('selectedThread', thread.id);
    const fetchedMessages = await fetchMessages(thread.id);
    if (Array.isArray(fetchedMessages)) {
      const formattedMessages = fetchedMessages
        .filter((msg: any) => !msg.metadata?.system)
        .map((msg: any) => ({
          ...msg,
          content: msg.content.map((c: any) => c.text.value).join(' ')
        })).sort((a: { created_at: number; role: string }, b: { created_at: number; role: string }) => {
          if (a.created_at === b.created_at) {
            return a.role === 'assistant' ? -1 : 1;
          }
          return a.created_at - b.created_at;
        });
      setMessages(formattedMessages);
    } else {
      console.error('Fetched messages are not an array:', fetchedMessages);
    }
  };

  const setInitialMessages = (messageContent: string) => {
    const initialMessage = {
      id: `temp-${Date.now()}`,
      role: 'system',
      content: `Como posso te ajudar hoje?`
    };
    const userMessage = {
      id: `temp-${Date.now() + 1}`,
      role: 'user',
      content: messageContent
    };
    console.log('messages: ', messages)
    console.log('Setting initial messages:', initialMessage, userMessage);
    // Set initial messages immediately
    setMessages(() => [initialMessage]);
    console.log('Initial messages set:', [initialMessage, userMessage]);
    console.log('messages: ', messages)

  };

  const sendFirstMessage = (messageContent: string) => {
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    const selectedCustomer = localStorage.getItem('selectedCustomer') || undefined;
    setInitialMessages(messageContent);
    handleOptionClick(messageContent, userId, selectedCustomer);
  };

  const handleOptionClick = async (messageContent: string, userId?: string, selectedCustomer?: string) => {
    if (!selectedThread) {
      const google = localStorage.getItem('googleAccounts') || undefined;
      const parsedGoogle = google ? JSON.parse(google) : [];
      const accessToken = parsedGoogle?.[0]?.access_token;

      if (userId) {
        const newThreadResponse = await createThread(messageContent, userId, selectedCustomer, accessToken);
        const newThread = newThreadResponse.result;
        setThreads((prevThreads) => [...prevThreads, newThread]);
        setSelectedThread(newThread);
        localStorage.setItem('selectedThread', newThread.id);

        await handleSendMessage(messageContent, newThread.id);
        const fetchedMessages = await fetchMessages(newThread.id);
        const formattedMessages = fetchedMessages
          .filter((msg: any) => !msg.metadata?.system)
          .map((msg: any) => ({
            ...msg,
            content: msg.content.map((c: any) => c.text.value).join(' ')
          })).sort((a: { created_at: number; role: string }, b: { created_at: number; role: string }) => {
            if (a.created_at === b.created_at) {
              return a.role === 'assistant' ? -1 : 1;
            }
            return a.created_at - b.created_at;
          });
        setMessages(() => [...formattedMessages]);
      }
    } else {
      await handleSendMessage(messageContent, selectedThread.id);
    }
  };

  const handleSendMessage = async (messageContent: string, threadId?: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = ''; // Clear the textarea

    const thread = threadId || selectedThread?.id;
    if (!thread) {
      sendFirstMessage(messageContent);
      return;
    }

    const newMessage = { id: `temp-${Date.now()}`, role: 'user', content: messageContent };
    setMessages((prevMessages) => [...prevMessages, newMessage].sort((a, b) => {
      if (a.created_at === b.created_at) {
        return a.role === 'assistant' ? -1 : 1;
      }
      return a.created_at - b.created_at;
    }));

    try {
      const user = localStorage.getItem('user') || undefined;
      const google = localStorage.getItem('googleAccounts') || undefined;
      const parsedUser = user ? JSON.parse(user) : undefined;
      const userId = parsedUser?.id;
      const parsedGoogle = google ? JSON.parse(google) : [];
      const accessToken = parsedGoogle?.[0]?.access_token;
      const refreshToken = parsedGoogle?.[0]?.refresh_token;

      const selectedCustomer = localStorage.getItem('selectedCustomer') || undefined;
      let validAccessToken
      try {
        validAccessToken = await validateAndRefreshGoogleToken(accessToken, refreshToken);
      } catch (tokenError) {
        console.error('Error validating or refreshing token:', tokenError);
        navigate('/login');
        return;
      }
      await getGPTResponseWithToken(messageContent, userId, thread, selectedCustomer, validAccessToken);

      setElapsedTime(0); // Reset elapsed time after sending a message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getGPTResponseWithToken = async (messageContent: string, userId: string, thread: string, selectedCustomer?: string, accessToken?: string) => {
    try {
      await getGPTResponse(messageContent, userId, thread, selectedCustomer, accessToken);
    } catch (error) {
      console.error('Error getting GPT response:', error);
      throw new Error('Error getting GPT response');
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
            newMessages[messageIndex].content += `\n\n**Comment:** ${comment}`;
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
            .sort((a, b) => b.created_at - a.created_at)
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
                messages.map((message) => (
                  <div key={message.id} className={`message-box ${message.role}`}>
                    <ReactMarkdown>
                      {message.role === 'user' ? (message.content.startsWith('\n      Prompt:') ? message.content.match(/Prompt:\s*(.*?)\s*User ID:/)?.[1]?.trim() : message.content) : message.content }
                    </ReactMarkdown>
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
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
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
