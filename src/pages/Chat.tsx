import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
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
  MessageSquare,
  Menu
} from 'lucide-react';
import { useChatStore } from '../lib/store';
import ReactMarkdown from 'react-markdown';
import AccountSidebar from '../components/AccountSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomers } from '../store/customersSlice';
import { listCustomers } from '../services/api';

interface Conversation {
  id: string;
  title?: string;
  threadId?: string;
  created_at: number;
  updated_at: number;
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
  
  const { messages, loading, conversations, currentConversation, setCurrentConversation, createConversation } = useChatStore();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(
    localStorage.getItem('selectedCustomer')
  );
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.auth.user?.id);
  const customers = useSelector((state: any) => state.customers.linked_customers || []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (!userId) return;
        const data = await listCustomers(userId);
        dispatch(setCustomers(data));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    if (userId && !customers.length) {
      fetchCustomers();
    }
  }, [userId, dispatch, customers.length]);

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
            {/* <Text 
              fontSize="sm" 
              color="gray.600" 
              mb={2}
              px={1}
            >
              Selecione o tipo de ação
            </Text> */}
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
                  bg="white"
                  boxShadow="sm"
                  cursor="pointer"
                  onClick={() => handleActionTypeClick(type.type)}
                  _hover={{ bg: 'gray.50' }}
                >
                  <HStack spacing={3} mb={1}>
                    <type.icon size={20} color="var(--chakra-colors-blue-500)" />
                    <Text fontWeight="medium">{type.text}</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
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
                bg="white"
                borderRadius="lg"
                border="1px"
                borderColor="gray.200"
                _hover={{ bg: 'blue.50', borderColor: 'blue.200', cursor: 'pointer' }}
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
                    color="blue.700" 
                    fontSize="sm"
                    noOfLines={1}
                    flex="1"
                  >
                    {action.text}
                  </Text>
                </HStack>
                <Text 
                  fontSize="sm" 
                  color="gray.600" 
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
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => prev + 1);
    }, 2000);

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

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

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

  const sortedMessages = [...messages].sort((a, b) => a.created_at - b.created_at);

  const handleCustomerClick = (customer_id: string) => {
    setSelectedCustomer(customer_id);
    localStorage.setItem('selectedCustomer', customer_id);
  };

  const selectedCustomerName = localStorage.getItem('selectedCustomerName');

  return (
    <Box
      display="flex"
      height="100vh"
      bg="gray.50"
    >
      {/* Account Sidebar */}
      <Box
        width="80px"
        bg="white"
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
            setSelectedAccount={handleCustomerClick}
          />
        </Box>
      </Box>

      {/* Drawer Overlay */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)"
          zIndex={3}
          onClick={onClose}
        >
          {/* Drawer Content */}
          <Box
            position="absolute"
            top={0}
            left="80px"
            width="300px"
            height="100%"
            bg="white"
            p={4}
            onClick={e => e.stopPropagation()}
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Conversas
            </Text>
            <VStack spacing={2} align="stretch">
              {conversations?.map((conv: Conversation) => (
                <Button
                  key={conv.id}
                  variant={currentConversation?.id === conv.id ? "solid" : "ghost"}
                  onClick={() => {
                    setCurrentConversation(conv);
                    onClose();
                  }}
                  leftIcon={<MessageSquare size={16} />}
                  justifyContent="flex-start"
                  w="100%"
                >
                  <Text isTruncated>
                    {conv.title || "Nova Conversa"}
                  </Text>
                </Button>
              ))}
              <Divider />
              <Button
                colorScheme="blue"
                onClick={() => {
                  createConversation();
                  onClose();
                }}
                leftIcon={<Plus size={16} />}
              >
                Nova Conversa
              </Button>
            </VStack>
          </Box>
        </Box>
      )}

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
          bg="white"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          height="50px" // Diminua a altura do Chat Header
        >
          <Text fontWeight="semibold" fontSize="lg">
            {`${selectedCustomerName}` || 'Chat'}
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
          bg="white"
        >
          {/* <Box py={3} px={4} borderBottom="1px" borderColor="gray.200" bg="white">
            <HStack spacing={4}>
              <Text fontWeight="medium">Chat</Text>
            </HStack>
          </Box> */}

          <Box flex={1} overflowY="auto" px={4} py={6} display="flex" flexDirection="column" gap={4} bg="gray.50">
            {(!sortedMessages || sortedMessages.length === 0) ? (
              <Box flex={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" textAlign="center" px={4} minH="full" py={2}>
                <VStack spacing={4} maxW="600px">
                  <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.500, blue.600)" bgClip="text">
                    Assistente de Marketing Digital
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Gerencie suas campanhas de marketing e análise de dados de forma inteligente
                  </Text>
                  <VStack spacing={2} color="gray.600" width="100%" align="start">
                    <HStack>
                      <Box color="blue.500">✨</Box>
                      <Text>Crie e gerencie campanhas de marketing</Text>
                    </HStack>
                    <HStack>
                      <Box color="blue.500">📊</Box>
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
                  </VStack>
                  <Text color="gray.500" fontSize="sm" mt={2}>
                    Digite "/" ou abra as açoes para ver sugetões de uso.
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.500" mt={4}>
                    Bem-vindo ao seu assistente de marketing digital!
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Estamos aqui para ajudar você a alcançar seus objetivos de marketing.
                  </Text>
                </VStack>
              </Box>
            ) : (
              <>
                {sortedMessages.map((message, index) => (
                  <Box key={index} alignSelf={message.role === "assistant" ? "flex-start" : "flex-end"} maxW={{ base: "90%", md: "70%" }}>
                    <Box p={4} bg={message.role === 'assistant' ? 'white' : 'blue.50'} borderRadius="lg" boxShadow="sm" position="relative">
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
              </>
            )}
            {loading && (
              <Box alignSelf="flex-start" maxW={{ base: "90%", md: "70%" }}>
                <Box bg="white" px={4} py={3} borderRadius="lg" boxShadow="sm" position="relative">
                  <Box position="absolute" top={-6} left={2} bg="blue.500" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                    Assistente
                  </Box>
                  <Text color="gray.600">
                    {loadingMessages[loadingMessageIndex % loadingMessages.length]}
                  </Text>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box borderTop="1px" borderColor="gray.200" bg="white">
            {renderSuggestions()}
          </Box>

          <Box p={4} borderTop="1px" borderColor="gray.200" bg="white">
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