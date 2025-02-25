import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  Textarea,
  useDisclosure,
  VStack,
  Image
} from '@chakra-ui/react';

import { 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Eye, 
  Edit, 
  Activity,
  FileText,
  FileSpreadsheet,
  Menu
} from 'lucide-react';
import { selectThreads, Thread } from '../store/threadsSlice';
import { selectCustomers } from '../store/customersSlice';
import { useAppSelector, useAppDispatch } from '../store';
import AccountSidebar from '../components/AccountSidebar';
import ConversationList from '../components/ConversationList';
import ReactMarkdown from 'react-markdown';
import { fetchThreadsList, sendMessage } from '../store/threadsSlice';
import { selectUser } from '../store/authSlice';

interface Message {
  role: 'user' | 'assistant';
  content: string | string[];
  created_at: number;
}

type ActionType = {
  type: string;
  text: string;
  icon: any;
  description: string;
  actions: Array<{
    text: string;
    message: string;
    icon: any;
  }>;
};

export default function Chat() {
  const [input, setInput] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isSuggestionsMinimized, setIsSuggestionsMinimized] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(
    localStorage.getItem('selectedCustomer')
  );
  
  const dispatch = useAppDispatch();
  const threads = useAppSelector(selectThreads);
  const customers = useAppSelector(selectCustomers);
  const user = useAppSelector(selectUser);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch threads when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchThreadsList(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (threads.length > 0 && !currentThread) {
      setCurrentThread(threads[0]);
    }
  }, [threads, currentThread]);

  useEffect(() => {
    if (currentThread?.messages) {
      setMessages(currentThread.messages);
    }
  }, [currentThread]);

  const actionTypes: ActionType[] = [
    {
      type: 'create',
      text: 'Criar',
      icon: Plus,
      description: 'Criar novos recursos',
      actions: [
        { text: 'Nova Conta', message: '/create account', icon: Plus },
        { text: 'Nova Campanha', message: '/create campaign', icon: Plus },
        { text: 'Novo Post', message: '/create post', icon: FileText }
      ]
    },
    {
      type: 'view',
      text: 'Visualizar',
      icon: Eye,
      description: 'Ver recursos existentes',
      actions: [
        { text: 'Ver Contas', message: '/view accounts', icon: Eye },
        { text: 'Ver Campanhas', message: '/view campaigns', icon: Eye },
        { text: 'Ver Posts', message: '/view posts', icon: Eye }
      ]
    },
    {
      type: 'update',
      text: 'Atualizar',
      icon: Edit,
      description: 'Atualizar recursos',
      actions: [
        { text: 'Atualizar Conta', message: '/update account', icon: Edit },
        { text: 'Atualizar Campanha', message: '/update campaign', icon: Edit },
        { text: 'Atualizar Post', message: '/update post', icon: Edit }
      ]
    },
    {
      type: 'status',
      text: 'Status',
      icon: Activity,
      description: 'Ver status dos recursos',
      actions: [
        { text: 'Status da Conta', message: '/status account', icon: Activity },
        { text: 'Status da Campanha', message: '/status campaign', icon: Activity },
        { text: 'Status do Post', message: '/status post', icon: Activity }
      ]
    },
    {
      type: 'report',
      text: 'Relatórios',
      icon: FileText,
      description: 'Gerar relatórios',
      actions: [
        { text: 'Relatório da Conta', message: '/report account', icon: FileSpreadsheet },
        { text: 'Relatório da Campanha', message: '/report campaign', icon: FileSpreadsheet },
        { text: 'Relatório do Post', message: '/report post', icon: FileSpreadsheet }
      ]
    }
  ];

  const handleActionTypeClick = (type: string) => {
    setSelectedActionType(type);
  };

  const handleBackToTypes = () => {
    setSelectedActionType(null);
  };

  const handleSelectConversation = (threadId: string) => {
    localStorage.setItem('activeThread', threadId);
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setCurrentThread(thread);
      setMessages(thread.messages || []);
    } else {
      setCurrentThread(null);
      setMessages([]);
    }
    onClose();
  };


  const renderSuggestions = () => {
    if (!selectedActionType) {
      return (
        <Box
          height={isSuggestionsMinimized ? "40px" : "auto"}
          overflow="hidden"
          transition="all 0.2s ease-in-out"
        >
          <HStack spacing={2} h="40px" alignItems="center" px={1}>
            <IconButton
              aria-label="Minimizar/Expandir sugestões"
              icon={isSuggestionsMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              size="sm"
              variant="ghost"
              padding={0}
              minW="24px"
              height="24px"
              onClick={() => setIsSuggestionsMinimized(!isSuggestionsMinimized)}
            />
            <Text fontWeight="medium" color="gray.600" fontSize="sm" noOfLines={1}>
              Ações
            </Text>
          </HStack>
          <Box
            sx={{
              opacity: isSuggestionsMinimized ? 0 : 1,
              height: isSuggestionsMinimized ? 0 : 'auto',
              overflow: 'hidden',
              transition: 'all 0.2s ease-in-out',
              transform: isSuggestionsMinimized ? 'translateY(10px)' : 'translateY(0)',
            }}
          >
            <SimpleGrid 
              columns={{ base: 1, sm: 2, md: 3 }} 
              spacing={2}
              templateColumns="repeat(auto-fit, minmax(140px, 1fr))"
              width="100%"
            >
              {actionTypes.map((type) => (
                <Box
                  key={type.text}
                  p={3}
                  borderRadius="md"
                  bg="gray.700" // Background mais escuro
                  boxShadow="sm"
                  cursor="pointer"
                  onClick={() => handleActionTypeClick(type.type)}
                  _hover={{ bg: 'gray.600' }} // Background mais escuro
                >
                  <HStack spacing={3} mb={1}>
                    <type.icon size={20} color="var(--chakra-colors-blue-500)" />
                    <Text fontWeight="medium" color="white">{type.text}</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.300">
                    {type.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      );
    }

    const currentType = actionTypes.find(at => at.type === selectedActionType);
    if (!currentType) return null;

    return (
      <Box 
        display="flex" 
        flexDirection="column"
      >
        <HStack spacing={2} h="40px" alignItems="center">
          <IconButton
            aria-label="Voltar"
            icon={<ChevronUp size={14} />}
            size="sm"
            variant="ghost"
            onClick={handleBackToTypes}
          />
          <Text fontWeight="medium" color="gray.600" fontSize="sm" noOfLines={1}>
            {currentType.text}
          </Text>
        </HStack>
        <Box
          style={{
            height: isSuggestionsMinimized ? 0 : 'auto',
            opacity: isSuggestionsMinimized ? 0 : 1,
            overflow: 'hidden'
          }}
        >
          <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 3 }} 
            spacing={2}
            templateColumns="repeat(auto-fit, minmax(140px, 1fr))"
          >
            {currentType.actions.map((action) => (
              <Box
                key={action.text}
                p={3}
                bg="gray.700" // Background mais escuro
                borderRadius="lg"
                border="1px"
                borderColor="gray.600" // Background mais escuro
                _hover={{ bg: 'gray.600', borderColor: 'gray.500', cursor: 'pointer' }} // Background mais escuro
                onClick={() => {
                  handleCommandClick(action.message);
                  setSelectedActionType(null);
                }}
                display="flex"
                flexDirection="column"
                overflow="hidden"
                minH="85px"
                gap={1}
              >
                <HStack spacing={2}>
                  <action.icon size={24} color="var(--chakra-colors-blue-500)" flexShrink={0} />
                  <Text 
                    fontWeight="medium" 
                    color="white" 
                    fontSize="sm"
                    noOfLines={1}
                    flex="1"
                  >
                    {action.text}
                  </Text>
                </HStack>
                <Text 
                  fontSize="sm" 
                  color="gray.300" // Background mais escuro
                  noOfLines={1}
                >
                  {action.message}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    );
  };

  const loadingMessages = [
    "Pensando...",
    "Processando sua mensagem...",
    "Gerando resposta...",
    "Analisando o contexto...",
    "Elaborando uma resposta...",
    "Organizando as ideias...",
    "Quase lá...",
    "Finalizando o raciocínio...",
    "Revisando a resposta...",
    "Preparando a resposta...",
    "Aguarde um momento...",
    "Refinando a resposta...",
    "Quase pronto...",
    "Ajustando detalhes...",
    "Verificando informações...",
    "Compilando dados...",
    "Formatando a resposta...",
    "Checando consistência...",
    "Validando informações...",
    "Finalizando...",
    "Aguarde, por favor..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => prev + 1);
    }, 2000); // Aumenta o intervalo para 5 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const trimmedInput = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const newMessage: Message = {
      role: 'user',
      content: trimmedInput,
      created_at: Date.now()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setLoading(true);

    try {
      const activeThread = localStorage.getItem('activeThread');
      const selectedCustomer = localStorage.getItem('selectedCustomer');
      const userId = user?.id || '';
      const customerGestor = localStorage.getItem('customerGestor');
      const token = localStorage.getItem('@Piloto:token');

      const response = await fetch('http://localhost:8080/api/gpt/create-thread-and-send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: trimmedInput,
          userId,
          thread: activeThread,
          customerId: selectedCustomer,
          customerGestor,
          metadata: {
            title: trimmedInput,
            user_id: userId,
            customer_id: selectedCustomer,
            gestor_id: customerGestor
          }
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader?.read()!;
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'init') {
              localStorage.setItem('activeThread', data.threadId);
              setCurrentThread({ id: data.threadId, messages: [data.userMessage] } as unknown as Thread);
              setMessages(prevMessages => [...prevMessages, data.userMessage]);
            } else if (data.type === 'status') {
              console.log(`Status: ${data.status}`);
            } else if (data.type === 'done') {
              const assistantMessage: Message = {
                role: 'assistant',
                content: data.content,
                created_at: Date.now()
              };
              setMessages(prevMessages => [
                ...prevMessages,
                assistantMessage
              ]);
              setLoading(false);
            }
          }
        }
      }

      // Refresh threads list after sending message
      if (userId) {
        dispatch(fetchThreadsList(userId));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeThread = localStorage.getItem('activeThread');
    if (activeThread) {
      const thread = threads.find(t => t.id === activeThread);
      if (thread) {
        setCurrentThread(thread);
        setMessages(thread.messages || []);
      }
    } else {
      setCurrentThread(null);
      setMessages([]);
    }
  }, [threads]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const lineHeight = 20;
      const padding = 16;
      const maxLines = 10;
      const maxHeight = (maxLines * lineHeight) + padding;
      
      textareaRef.current.style.height = 'auto';
      const contentHeight = textareaRef.current.scrollHeight;
      
      if (contentHeight <= maxHeight) {
        textareaRef.current.style.height = `${contentHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      } else {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = 'auto';
      }
    }
  };

  const handleFocus = () => {
    adjustTextareaHeight();
  };

  const handleBlur = () => {
    if (textareaRef.current && !input.trim()) {
      textareaRef.current.style.height = '40px';
      textareaRef.current.style.overflowY = 'hidden';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleCommandClick = (command: string) => {
    setInput(command + ' ');
    setSelectedActionType(null);
  };

  const handleCustomerClick = (customer_id: string) => {
    setSelectedCustomer(customer_id);
    localStorage.setItem('selectedCustomer', customer_id);
  };

  const selectedCustomerName = localStorage.getItem('selectedCustomerName') || 'Chat';

  return (
    <Box
      display="flex"
      height="100vh"
      bg="gray.800" // Background mais escuro
    >
      {/* Account Sidebar */}
      <Box
        width="80px"
        bg="gray.900" // Background mais escuro
        position="relative"
        display="flex"
        flexDirection="column"
      >
        <Box p={4} display="flex" flexDirection="column" alignItems="center">
          <IconButton
            aria-label="Menu"
            icon={<Menu size={20} />}
            variant="ghost"
            onClick={onOpen}
            colorScheme="blue"
          />
        </Box>
        <Box flex={1}>
          <AccountSidebar 
            selectedAccount={selectedCustomer}
            setSelectedAccount={handleCustomerClick} activeCustomers={[]}          />
        </Box>
      </Box>

      {/* Conversation List */}
      <ConversationList
        isOpen={isOpen}
        onClose={onClose}
        onSelectConversation={handleSelectConversation}
      />

      {/* Main Chat Area */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Chat Header */}
        <Box
          py={1}
          px={4}
          bg="gray.900" // Background mais escuro
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          height="50px"
        >
          <Text fontWeight="semibold" fontSize="lg" color="white">
            {selectedCustomerName}
          </Text>
          <Image
            src="/logo.svg"
            alt="Logo"
            width="94px"
            height="94px"
            objectFit="contain"
          />
        </Box>

        {/* Messages Area */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          overflow="hidden"
          bg="gray.800" // Background mais escuro
        >
          <Box flex={1} overflowY="auto" px={4} py={6} display="flex" flexDirection="column" gap={4} bg="gray.800">
            <Box flex={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" textAlign="center" px={4} minH="full" py={2}>
              <VStack spacing={4} maxW="600px">
                <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.500, blue.600)" bgClip="text">
                  Assistente de Marketing Digital
                </Text>
                <Text fontSize="md" color="gray.400">
                  Gerencie suas campanhas de marketing e análise de dados de forma inteligente
                </Text>
                <VStack spacing={2} color="gray.400" width="100%" align="start">
                  <HStack>
                    <Box color="blue.500">📊</Box>
                    <Text>Crie e gerencie campanhas de marketing</Text>
                  </HStack>
                  <HStack>
                    <Box color="blue.500">✨</Box>
                    <Text>Visualize relatórios e métricas</Text>
                  </HStack>
                  <HStack>
                    <Box color="blue.500">🎯</Box>
                    <Text>Otimize suas estratégias digitais</Text>
                  </HStack>
                  <HStack>
                    <Box color="blue.500">💡</Box>
                    <Text>Receba insights personalizados</Text>
                  </HStack>
                  <Text color="gray.500" fontSize="sm" mt={2}>
                    Digite "/" ou abra as ações para ver sugestões de uso.
                  </Text>
                </VStack>
              </VStack>
            </Box>
            {messages.map((message, index) => (
              <Box key={index} alignSelf={message.role === "assistant" ? "flex-start" : "flex-end"} maxW={{ base: "90%", md: "70%" }}>
                <Box p={4} bg={message.role === 'assistant' ? 'gray.700' : 'blue.50'} borderRadius="lg" boxShadow="sm" position="relative">
                  {message.role === 'assistant' && (
                    <Box position="absolute" top={-6} left={2} bg="blue.500" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                      Assistente
                    </Box>
                  )}
                  <ReactMarkdown className="markdown-content">
                    {Array.isArray(message.content) ? message.content.join('\n') : message.content}
                  </ReactMarkdown>
                </Box>
              </Box>
            ))}
            {loading && (
              <Box alignSelf="flex-start" maxW={{ base: "90%", md: "70%" }}>
                <Box bg="gray.700" px={4} py={3} borderRadius="lg" boxShadow="sm" position="relative">
                  <Box position="absolute" top={-6} left={2} bg="blue.500" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                    Assistente
                  </Box>
                  <Text color="gray.400">
                    {loadingMessages[loadingMessageIndex % loadingMessages.length]}
                  </Text>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Box p={4} borderTop="1px" borderColor="gray.700" bg="gray.900">
            {renderSuggestions()}
          </Box>
          <Box p={4} borderTop="1px" borderColor="gray.700" bg="gray.900">
            <form onSubmit={handleSubmit}>
              <HStack spacing={2}>
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  resize="none"
                  maxH="200px"
                  overflowY="auto"
                  bg="gray.700"
                  color="white"
                />
                <IconButton
                  aria-label="Enviar mensagem"
                  icon={<Send size={20} />}
                  type="submit"
                  colorScheme="blue"
                  isDisabled={!input.trim() || loading}
                />
              </HStack>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}