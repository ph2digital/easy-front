import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { linkMetaAds, getSessionFromLocalStorage, fetchThreads, createThread, submitComment, validateAndRefreshGoogleToken, getGPTResponseStream, fetchMessages as apiFetchMessages } from '../services/api';

// Exportar tipos para uso em outros componentes
export interface Message {
  id: string;
  role: string;
  system: boolean;
  content: string;
  created_at: number;
  metadata?: any;
}

export interface ThreadItem {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  metadata: {
    title: string;
    user_id: string;
    customer_gestor: string;
    selected_customer: string;
  };
  object: string;
  tool_resources: Record<string, any>;
}

interface Thread {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  metadata: {
    title: string;
    user_id: string;
    customer_gestor: string;
    selected_customer: string;
  };
  object: string;
  tool_resources: Record<string, any>;
}

export const useChatFunctions = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(localStorage.getItem('selectedAccount'));
  const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);
  const [facebookAccounts, setFacebookAccounts] = useState<any[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<any[]>([]);
  const [loadingGoogleAccounts, setLoadingGoogleAccounts] = useState(true);
  const [loadingFacebookAccounts, setLoadingFacebookAccounts] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
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
        console.log('Carregando threads para userId:', userId);
        const fetchedThreads = await fetchThreads(userId);
        console.log('Threads recuperados:', fetchedThreads);
        
        // Adicionar log para verificar se há threads
        if (fetchedThreads && fetchedThreads.length > 0) {
          console.log('Número de threads:', fetchedThreads.length);
          console.log('Primeiro thread:', fetchedThreads[0]);
        } else {
          console.warn('Nenhum thread encontrado para o usuário');
        }
        
        const formattedThreads = formatThreads(fetchedThreads);
        setThreads(formattedThreads);
        setSelectedAccount(userId);
      } else {
        console.error('Não foi possível recuperar o userId da sessão');
      }
    };
    loadThreads();
  }, [selectedAccount]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let isFetching = false;

    console.group('🔄 Polling Setup');
    console.log('⏱️ Current Polling Interval:', pollingInterval);
    console.log('🧵 Selected Thread:', selectedThread?.id);

    if (pollingInterval !== null && selectedThread) {
      console.log('🟢 Polling Activated');
      setIsTyping(true);
      intervalId = setInterval(async () => {
        if (!isFetching) {
          console.log('🔍 Polling Iteration');
          isFetching = true;
          setElapsedTime((prev) => prev + 1);
          
          if (selectedThread) {
            console.log(`📡 Polling Thread: ${selectedThread.id}`);
            await fetchMessagesForThread(selectedThread.id);
          }
          
          isFetching = false;
        }
      }, pollingInterval);
    } else {
      console.log('🔴 Polling Deactivated');
      setIsTyping(false);
    }

    console.groupEnd();

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

  // Método para recuperar contexto de inicialização
  const getThreadInitializationContext = () => {
    const context = localStorage.getItem('thread_initialization_context');
    return context ? JSON.parse(context) : null;
  };

  const formatThreads = (threads: any[]): ThreadItem[] => {
    // Ordena threads por data de criação em ordem decrescente
    const sortedThreads = threads.sort((a, b) => b.created_at - a.created_at);

    // Mapeia threads para o formato esperado, incluindo título dos metadados
    return sortedThreads.map((thread) => ({
      id: thread.id,
      user_id: thread.user_id,
      created_at: thread.created_at,
      updated_at: thread.updated_at,
      status: thread.status,
      metadata: thread.metadata || {},
      object: thread.object,
      tool_resources: thread.tool_resources || {}
    }));
  };

  const fetchMessagesForThread = async (thread: string) => {
    try {
      console.log('🧵 Fetching Messages');
      console.log('📡 Thread ID:', thread);

      const response = await apiFetchMessages(thread);
      console.log('📦 Total Messages:', response.total_messages);

      // Verificação robusta da estrutura da resposta
      if (!response || !response.result || !Array.isArray(response.result.data)) {
        console.error('❌ Invalid response structure:', response);
        return [];
      }

      const messages = response.result.data;
      console.log('📨 Raw Messages:', messages);

      return preprocessThreadMessages(messages);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      return [];
    }
  };

  const preprocessThreadMessages = (messages: any[], userMessage?: string): Message[] => {
    console.group('🚀 Thread Message Preprocessing');
    console.log('📦 Total Raw Messages:', messages.length);
    console.log('💬 User Message:', userMessage);

    // Registrar todos os detalhes das mensagens
    messages.forEach((msg, index) => {
      console.log(`🔍 Raw Message ${index + 1} Details:`, {
        id: msg.id,
        role: msg.role,
        metadata: msg.metadata,
        content: msg.content,
        technical_init: msg.metadata?.technical_init,
        system: msg.metadata?.system
      });
    });

    // Estratégia de filtragem mais sofisticada
    const processedMessages = messages
      .filter(msg => {
        // Critérios para identificar e remover mensagens de inicialização
        const isInitMessage = 
          msg.metadata?.technical_init === 'true' ||
          msg.metadata?.system === true ||
          msg.role === 'system' ||
          (Array.isArray(msg.content) && msg.content.some((c: any) => 
            typeof c.text?.value === 'string' && (
              c.text.value.includes('Inicialização de conversa') ||
              c.text.value.includes('Initializing conversation') ||
              c.text.value.trim().length === 0
            )
          ));

        console.log(`🚫 Message Filtering: ${isInitMessage ? 'REMOVED' : 'KEPT'}`, {
          id: msg.id,
          role: msg.role,
          content: msg.content
        });

        return !isInitMessage;
      })
      .map((msg: any) => ({
        id: msg.id || `temp-${Date.now()}-${msg.role}`,
        role: msg.role,
        system: msg.metadata?.system || false,
        content: Array.isArray(msg.content) 
          ? msg.content
              .map((c: any) => c.text?.value || c.text || '')
              .filter((content: string) => content.trim().length > 0)
              .join(' ')
          : msg.content || '',
        created_at: msg.created_at || new Date().getTime(),
        metadata: msg.metadata || {}
      }))
      .sort((a, b) => a.created_at - b.created_at);

    // Garantir que pelo menos uma mensagem seja mantida, preferencialmente espelhando a mensagem do usuário
    const finalMessages = processedMessages.length > 0 
      ? processedMessages 
      : userMessage 
        ? [{
            id: `fallback-${Date.now()}`,
            role: 'user',
            system: false,
            content: userMessage,
            created_at: new Date().getTime(),
            metadata: {}
          }]
        : messages.slice(0, 1).map((msg: any) => ({
            id: msg.id || `fallback-${Date.now()}`,
            role: msg.role,
            system: false,
            content: 'Mensagem inicial',
            created_at: new Date().getTime(),
            metadata: {}
          }));

    console.log('🧹 Messages After Preprocessing:', finalMessages.length);
    console.groupEnd();

    return finalMessages;
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

  const handleThreadClick = async (thread: Thread) => {
    try {
      console.group('🔍 Thread Click Handling');
      console.log('📄 Selected Thread:', thread);

      // Definir thread selecionada
      setSelectedThread(thread);
      localStorage.setItem('selectedThread', JSON.stringify(thread));

      // Buscar mensagens da thread
      const fetchedMessages = await apiFetchMessages(thread.id);
      console.log('Fetched messages on thread click:', fetchedMessages);

      // Verificar se há mensagens
      if (fetchedMessages?.result?.object === 'list' && Array.isArray(fetchedMessages.result.data)) {
        console.log('🧵 Raw Fetched Messages:', fetchedMessages.result.data);
        
        // Preprocessar mensagens
        const preprocessedMessages = preprocessThreadMessages(fetchedMessages.result.data);
        
        console.log('🎨 Preprocessed Messages:', preprocessedMessages);

        // Definir mensagens
        setMessages(preprocessedMessages);
        localStorage.setItem('messages', JSON.stringify(preprocessedMessages));

        // Garantir que as mensagens sejam exibidas
        if (preprocessedMessages.length === 0) {
          console.warn('⚠️ No messages found for thread, initializing empty conversation');
          setMessages([{
            id: `init-${Date.now()}`,
            role: 'system',
            content: 'Iniciar nova conversa',
            created_at: new Date().getTime(),
            system: false
          }]);
        }
      } else {
        console.warn('❌ Invalid messages structure:', fetchedMessages);
        // Inicializar conversa vazia se não houver mensagens válidas
        setMessages([{
          id: `init-${Date.now()}`,
          role: 'system',
          content: 'Iniciar nova conversa',
          created_at: new Date().getTime(),
          system: false
        }]);
      }

      console.groupEnd();
    } catch (error) {
      console.error('❌ Error in handleThreadClick:', error);
      
      // Tratamento de erro: inicializar conversa vazia
      setMessages([{
        id: `error-${Date.now()}`,
        role: 'system',
        content: 'Erro ao carregar conversa. Tente novamente.',
        created_at: new Date().getTime(),
        system: false
      }]);
    }
  };

  const sendFirstMessage = (messageContent: string) => {
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    const selectedCustomer = localStorage.getItem('selectedCustomer');
    const customerGestor = localStorage.getItem('customerGestor') || undefined;
    handleOptionClick(messageContent, userId, selectedCustomer || undefined, customerGestor);
  };

  const handleOptionClick = async (messageContent: string, userId?: string, selectedCustomer?: string, customerGestor?: string) => {
    if (!selectedThread) {
      const google = localStorage.getItem('googleAccounts') || undefined;
      const parsedGoogle = google ? JSON.parse(google) : [];
      const accessToken = parsedGoogle?.[0]?.access_token;

      if (userId) {
        const newThreadResponse = await createThread(messageContent, userId, selectedCustomer || undefined, accessToken, customerGestor || undefined);
        const newThread = newThreadResponse.result;
        setThreads((prevThreads) => [...prevThreads, newThread]);
        setSelectedThread(newThread);
        localStorage.setItem('selectedThread', newThread.id);

        await handleSendMessage(messageContent, newThread.id);
        console.log(`Fetching messages for new thread ${newThread.id}`);
        const fetchedMessages = await apiFetchMessages(newThread.id);
        console.log('Fetched messages for new thread:', fetchedMessages);

        // Adicionar log e preprocessamento antes da renderização
        if (fetchedMessages?.result?.object === 'list' && Array.isArray(fetchedMessages.result.data)) {
          console.log('🚨 Raw Fetched Messages:', fetchedMessages.result.data);
          
          const preprocessedMessages = preprocessThreadMessages(fetchedMessages.result.data, messageContent);
          
          console.log('🎨 Preprocessed Messages:', preprocessedMessages);

          setMessages(preprocessedMessages);
          localStorage.setItem('messages', JSON.stringify(preprocessedMessages));
        } else {
          console.error('Fetched messages are not an array:', fetchedMessages);
        }
      }
    } else {
      await handleSendMessage(messageContent, selectedThread.id);
    }
  };

  const handleSendMessage = async (messageContent: string, thread: string) => {
    if (!messageContent.trim()) return;

    setIsTyping(true);

    try {
      const user = localStorage.getItem('user') || undefined;
      const google = localStorage.getItem('googleAccounts') || undefined;
      const parsedUser = user ? JSON.parse(user) : undefined;
      const userId = parsedUser?.id;
      const parsedGoogle = google ? JSON.parse(google) : [];
      const accessToken = parsedGoogle?.[0]?.access_token;
      const refreshToken = parsedGoogle?.[0]?.refresh_token;
  
      const selectedCustomer = localStorage.getItem('selectedCustomer') || null;
      const customerGestor = localStorage.getItem('customerGestor') || null;
      
      let validAccessToken;
      try {
        validAccessToken = await validateAndRefreshGoogleToken(accessToken, refreshToken);
      } catch (tokenError) {
        console.error('Error validating or refreshing token:', tokenError);
        navigate('/login');
        return;
      }

      // Adicionar a mensagem do usuário imediatamente
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        system: false,
        content: messageContent,
        created_at: Date.now()
      };

      // Criar a mensagem do assistente que será atualizada com o streaming
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        system: false,
        content: '',
        created_at: Date.now()
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);

      // Iniciar o streaming
      await getGPTResponseStream(
        messageContent,
        userId,
        thread,
        selectedCustomer,
        validAccessToken,
        customerGestor,
        (chunk) => {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content += chunk;
            }
            return newMessages;
          });
        }
      );

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'system',
          system: true,
          content: `Ocorreu um erro ao obter a resposta do GPT. Detalhes do erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          created_at: Date.now()
        }
      ]);
    } finally {
      setIsTyping(false);
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

  // Função para simular digitação
  const simulateTyping = (text: string, callback: (partialText: string) => void) => {
    let index = 0;

    const typeText = () => {
      if (index < text.length) {
        callback(text.slice(0, index + 1));
        index++;
        setTimeout(typeText, 20); // Ajuste a velocidade de digitação conforme necessário
      }
    };

    typeText();
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
    setShowCommentInput,
    simulateTyping,
    getThreadInitializationContext,
  };
};
