import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { linkMetaAds, getSessionFromLocalStorage, fetchThreads, createThread, submitComment, validateAndRefreshGoogleToken, fetchRuns,getGPTResponse, fetchMessages as apiFetchMessages } from '../services/api';

export const useChatFunctions = () => {
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

    // Clear selectedThread and activeThread on page load
    setSelectedThread(null);
    localStorage.removeItem('selectedThread');
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
      }
    };
    loadThreads();
  }, [selectedAccount]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let isFetching = false;

    if (pollingInterval !== null && selectedThread) {
      setIsTyping(true);
      intervalId = setInterval(async () => {
        if (!isFetching) {
          isFetching = true;
          setElapsedTime((prev) => prev + 1);
          if (selectedThread) {
            console.log(`Polling messages for thread ${selectedThread.id}`);
            await fetchMessagesForThread(selectedThread.id);
          }
          isFetching = false;
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
    } else {
      setPollingInterval(10000); // 10 seconds
    } 
  }, [elapsedTime]);

  const formatMessages = (messages: any[]) => {
    console.log('Formatting messages:', messages);
  
    const filteredMessages = messages.filter((msg: any) => {
      const isSystemMessage = msg.metadata?.system;
      console.log(`Message ID ${msg.id} is ${isSystemMessage ? 'a system message' : 'not a system message'}`);
      return !isSystemMessage;
    });
  
    const nonSystemMessages = filteredMessages.map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      system: msg.metadata?.system || false,
      content: msg.content.map((c: any) => c.text?.value || c.text).join(' '),
      created_at: msg.created_at
    }));
  
    console.log('Non-system messages:', nonSystemMessages);
  
    const sortedMessages = nonSystemMessages.sort((a: { created_at: number; }, b: { created_at: number; }) => b.created_at - a.created_at);
    console.log('Sorted messages:', sortedMessages);
  
    return sortedMessages;
  };
  
  const fetchMessagesForThread = async (threadId: string) => {
    try {
      console.log(`Fetching messages for thread ${threadId}`);
      const fetchedMessages = await apiFetchMessages(threadId);
      console.log('Fetched messages:', fetchedMessages);
      const result = fetchedMessages?.result?.data;
      if (Array.isArray(result)) {
        const formattedMessages = formatMessages(result);
  
        const currentMessageIds = messages.map((msg: any) => msg.id);
        const newMessageIds = formattedMessages.map((msg: any) => msg.id);
  
        if (JSON.stringify(currentMessageIds) !== JSON.stringify(newMessageIds)) {
          setMessages(formattedMessages);
          localStorage.setItem('messages', JSON.stringify(formattedMessages)); // Save to localStorage
          // Stop the polling loop
          setPollingInterval(null);
        }
      } else if (fetchedMessages?.result?.object === 'list' && Array.isArray(fetchedMessages.result.data)) {
        const formattedMessages = formatMessages(fetchedMessages.result.data);
        setMessages(formattedMessages);
        localStorage.setItem('messages', JSON.stringify(formattedMessages)); // Save to localStorage
      } else {
        console.error('Fetched messages are not an array:', fetchedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Stop polling after 3 consecutive errors
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
    console.log(`Fetching messages for thread ${thread.id} on thread click`);
    const fetchedMessages = await apiFetchMessages(thread.id);
    console.log('Fetched messages on thread click:', fetchedMessages);
    if (fetchedMessages?.result?.object === 'list' && Array.isArray(fetchedMessages.result.data)) {
      const formattedMessages = formatMessages(fetchedMessages.result.data);
      setMessages(formattedMessages);
    } else {
      console.error('Fetched messages are not an array:', fetchedMessages);
    }
  };

  const setInitialMessages = () => {
    const timestamp = Date.now();
    const initialMessage = {
      id: `temp-${timestamp}-system`,
      role: 'system',
      content: `Como posso te ajudar hoje?`
    };
    console.log('messages: ', messages)
    console.log('Setting initial messages:', initialMessage);
    // Set initial messages immediately
    setMessages([initialMessage]);
    console.log('Initial messages set:', [initialMessage]);
    console.log('messages: ', messages)
  };

  const sendFirstMessage = (messageContent: string) => {
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    const selectedCustomer = localStorage.getItem('selectedCustomer') || undefined;
    const customerGestor = localStorage.getItem('customerGestor') || undefined;
    setInitialMessages();
    handleOptionClick(messageContent, userId, selectedCustomer,customerGestor);
  };

  const handleOptionClick = async (messageContent: string, userId?: string, selectedCustomer?: string,customerGestor?: string) => {
    if (!selectedThread) {
      const google = localStorage.getItem('googleAccounts') || undefined;
      const parsedGoogle = google ? JSON.parse(google) : [];
      const accessToken = parsedGoogle?.[0]?.access_token;

      if (userId) {
        const newThreadResponse = await createThread(messageContent, userId, selectedCustomer, accessToken, customerGestor);
        const newThread = newThreadResponse.result;
        setThreads((prevThreads) => [...prevThreads, newThread]);
        setSelectedThread(newThread);
        localStorage.setItem('selectedThread', newThread.id);

        // Add default values to the new thread
        const initialMessage = {
          id: `temp-${Date.now()}`,
          role: 'system',
          content: `Como posso te ajudar hoje?`
        };

        setMessages([initialMessage]);
        localStorage.setItem('messages', JSON.stringify([initialMessage])); // Save to localStorage

        await handleSendMessage(messageContent, newThread.id);
        console.log(`Fetching messages for new thread ${newThread.id}`);
        const fetchedMessages = await apiFetchMessages(newThread.id);
        console.log('Fetched messages for new thread:', fetchedMessages);
        if (fetchedMessages?.result?.object === 'list' && Array.isArray(fetchedMessages.result.data)) {
          const formattedMessages = fetchedMessages.result.data
            .filter((msg: any) => !msg.metadata?.system)
            .map((msg: any) => ({
              ...msg,
              content: msg.content.map((c: any) => c.text?.value || c.text).join(' ')
            })).sort((a: { created_at: number; }, b: { created_at: number; }) => a.created_at - b.created_at);
          setMessages(formattedMessages);
          localStorage.setItem('messages', JSON.stringify(formattedMessages)); // Save to localStorage
        } else {
          console.error('Fetched messages are not an array:', fetchedMessages);
        }
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
  
    const newMessage = { id: `temp-${Date.now()}-user`, role: 'user', system: false, content: messageContent };
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage].sort((a, b) => {
        if (a.created_at === b.created_at) {
          return a.role === 'assistant' ? -1 : 1;
        }
        return a.created_at - b.created_at;
      });
      localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save to localStorage
      return updatedMessages;
    });
  
    try {
      const user = localStorage.getItem('user') || undefined;
      const google = localStorage.getItem('googleAccounts') || undefined;
      const parsedUser = user ? JSON.parse(user) : undefined;
      const userId = parsedUser?.id;
      const parsedGoogle = google ? JSON.parse(google) : [];
      const accessToken = parsedGoogle?.[0]?.access_token;
      const refreshToken = parsedGoogle?.[0]?.refresh_token;
  
      const selectedCustomer = localStorage.getItem('selectedCustomer') || undefined;
      const customerGestor = localStorage.getItem('customerGestor') || undefined;
      let validAccessToken;
      try {
        validAccessToken = await validateAndRefreshGoogleToken(accessToken, refreshToken);
      } catch (tokenError) {
        console.error('Error validating or refreshing token:', tokenError);
        navigate('/login');
        return;
      }
  
      // Keep typing indicator active and fetch messages while waiting for GPT response
      setIsTyping(true);
      const gptResponsePromise = getGPTResponseWithToken(messageContent, userId, thread, selectedCustomer, validAccessToken, customerGestor);
  
      setTimeout(() => {
        const pollingIntervalId = setInterval(async () => {
          try {
            console.log(`Polling messages for thread ${thread}`);
            const fetchedMessages = await apiFetchMessages(thread);
            console.log('Fetched messages during polling:', fetchedMessages);
            if (fetchedMessages?.result?.object === 'list' && Array.isArray(fetchedMessages.result.data)) {
              const formattedMessages = formatMessages(fetchedMessages.result.data);
              setMessages(formattedMessages);
              localStorage.setItem('messages', JSON.stringify(formattedMessages)); // Save to localStorage
            }
          } catch (error) {
            console.error('Error fetching messages:', error);
            // Ignore the error and continue
          }
        }, 1000); // Poll every 1 second
  
        gptResponsePromise.finally(async () => {
          clearInterval(pollingIntervalId);
          setIsTyping(false);
  
          // Fetch messages two more times after GPT response is completed
          for (let i = 0; i < 2; i++) {
            try {
              console.log(`Fetching messages for thread ${thread} after GPT response completion, attempt ${i + 1}`);
              const fetchedMessages = await apiFetchMessages(thread);
              console.log('Fetched messages after GPT response completion:', fetchedMessages);
              if (fetchedMessages?.result?.object === 'list' && Array.isArray(fetchedMessages.result.data)) {
                const formattedMessages = formatMessages(fetchedMessages.result.data);
                setMessages(formattedMessages);
                localStorage.setItem('messages', JSON.stringify(formattedMessages)); // Save to localStorage
              }
            } catch (error) {
              console.error('Error fetching messages after GPT response completion:', error);
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before the next fetch
          }
        }).catch((error) => {
          if (error.response?.status === 500) {
            clearInterval(pollingIntervalId);
            setIsTyping(false);
            console.error('GPT response returned status 500, stopping the loop');
            setMessages((prevMessages) => {
              const errorMessage = { id: `error-${Date.now()}`, role: 'system', system: true, content: 'Ocorreu um erro ao obter a resposta do GPT. Por favor, tente novamente mais tarde.' };
              const updatedMessages = [...prevMessages, errorMessage];
              localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save to localStorage
              return updatedMessages;
            });
          }
        });
      }, 5000); // Wait for 5 seconds before starting to fetch messages
  
      setElapsedTime(0); // Reset elapsed time after sending a message
  
      // Loop to list runs and messages
      const retryDelays = [
        ...Array(60).fill(1000), // 1 second for the first minute
        ...Array(108).fill(2000) // 2 seconds for the next 3.6 minutes
      ];
      let retryCount = 0;
      let runsInProgress = true;
      const maxLoopTime = 10 * 60 * 300; // 3 minutes
      const startTime = Date.now();
      let currentThread = selectedThread;
  
      while ((retryCount < retryDelays.length || runsInProgress) && (Date.now() - startTime < maxLoopTime)) {
        console.log(`Loop iteration ${retryCount + 1}: Checking runs and messages...`);
        if (!currentThread || currentThread.id !== selectedThread?.id) {
          console.warn('Thread changed or is empty, exiting loop');
          break;
        }
  
        try {
          const runsResponse = await fetchRuns(thread);
          console.log('Runs response:', runsResponse);
  
          const messagesResponse = await apiFetchMessages(thread);
          console.log('Messages response:', messagesResponse);
  
          if (runsResponse && messagesResponse) {
            const formattedMessages = formatMessages(messagesResponse);
            setMessages(formattedMessages);
            localStorage.setItem('messages', JSON.stringify(formattedMessages)); // Save to localStorage
            runsInProgress = Array.isArray(runsResponse.data) && runsResponse.data.some((run: any) => !run.completed_at && !run.cancelled_at && !run.failed_at);
            if (!runsInProgress) {
              console.log('All runs completed, exiting loop');
              await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
              const finalMessagesResponse = await apiFetchMessages(thread);
              const finalFormattedMessages = formatMessages(finalMessagesResponse);
              setMessages(finalFormattedMessages);
              localStorage.setItem('messages', JSON.stringify(finalFormattedMessages)); // Save to localStorage
              break;
            }
          } else {
            throw new Error('Empty response');
          }
        } catch (error: any) {
          retryCount++;
          console.warn(`Failed to retrieve runs or messages, retrying ${retryCount}/${retryDelays.length}`, { error: error.message });
          await new Promise(resolve => setTimeout(resolve, retryDelays[retryCount - 1])); // Wait for the specified delay
        }
  
        // Additional exit conditions to prevent infinite loops
        if (retryCount >= retryDelays.length) {
          console.error('Exceeded maximum retry attempts');
          setMessages((prevMessages) => {
            const errorMessage = { id: `error-${Date.now()}`, role: 'system', system: true, content: 'Ocorreu um erro ao obter as mensagens ou executar a ação. Por favor, tente novamente mais tarde.' };
            const updatedMessages = [...prevMessages, errorMessage];
            localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save to localStorage
            return updatedMessages;
          });
          break;
        }
        if (!runsInProgress && retryCount > 0) {
          console.warn('No runs in progress, exiting loop');
          break;
        }
      }
  
      if (retryCount >= retryDelays.length) {
        console.error('Failed to retrieve runs or messages after retries');
      }
  
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => {
        const errorMessage = { id: `error-${Date.now()}`, role: 'system', system: true, content: 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente mais tarde.' };
        const updatedMessages = [...prevMessages, errorMessage];
        localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save to localStorage
        return updatedMessages;
      });
    }
  };
  

  const getGPTResponseWithToken = async (messageContent: string, userId: string, thread: string, selectedCustomer?: string, accessToken?: string, customerGestor?: string) => {
    console.log('[getGPTResponseWithToken] Starting GPT response with token', { messageContent, userId, thread, selectedCustomer, accessToken, customerGestor });
    try {
      const response = await getGPTResponse(messageContent, userId, thread, selectedCustomer, accessToken, customerGestor);
      console.log('[getGPTResponseWithToken] GPT response received', { response });
      return response;
    } catch (error) {
      console.error('[getGPTResponseWithToken] Error getting GPT response', { error });
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', { response: error.response?.data, message: error.message });
      } else {
        console.error('Non-Axios error details:', { message: error.message, stack: error.stack });
      }
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
        localStorage.setItem('messages', JSON.stringify(newMessages)); // Save to localStorage
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

  return {
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
    setPollingInterval,
    setElapsedTime,
    setIsTyping,
    setBrowserUrl,
    setShowCommentInput,
  };
};

