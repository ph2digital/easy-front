import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Text,
  Textarea,
  useDisclosure,
  VStack,
  Image
} from '@chakra-ui/react';

import { 
  Send, 
  Plus,
  MessageSquare as MessageSquareIcon
} from 'lucide-react';
import { useChatStore, Message as ChatMessage, Conversation } from '../lib/store';
import ReactMarkdown from 'react-markdown';
import AccountSidebar from '../components/AccountSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomers } from '../store/customersSlice';
import { listCustomers } from '../services/api';

interface RootState {
  auth: {
    user?: {
      id: string;
    };
  };
  customers: {
    linked_customers: Customer[];
  };
}

interface Customer {
  id: string;
  customer_id: string;
  type: 'google_ads' | 'meta_ads';
  is_active: boolean;
  accountdetails_name: string | null;
  accountdetails_business_name: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function Chat() {
  const [input, setInput] = useState('');
  const { isOpen, onClose } = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading, conversations, currentConversation, setCurrentConversation, createConversation, sendMessage, setModel } = useChatStore();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(
    localStorage.getItem('selectedCustomer')
  );
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const customers = useSelector((state: RootState) => state.customers.linked_customers || []);
  const selectedCustomerData = customers.find(customer => customer.id === selectedCustomer);

  const getCustomerName = (customer: Customer | undefined): string => {
    if (!customer) return '';
    return customer.accountdetails_name || customer.accountdetails_business_name || customer.customer_id;
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomer(customerId);
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      localStorage.setItem('selectedCustomer', customerId);
      // Define o modelo base com base no tipo do cliente
      setModel(customer.type === 'google_ads' ? 'gpt-4' : 'gpt-3.5-turbo');
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer) {
        setModel(customer.type === 'google_ads' ? 'gpt-4' : 'gpt-3.5-turbo');
      }
    }
  }, [selectedCustomer, customers]);

  useEffect(() => {
    if (selectedCustomer) {
      localStorage.setItem('selectedCustomer', selectedCustomer);
    }
  }, [selectedCustomer]);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
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

  const sortedMessages = [...messages].sort((a, b) => a.created_at - b.created_at);

  return (
    <Box display="flex" minH="100vh" bg="#18181B" position="relative">
      <AccountSidebar 
        selectedAccount={selectedCustomer}
        setSelectedAccount={handleCustomerSelect}
      />
      <Box 
        flex="1" 
        ml="72px" 
        display="flex" 
        flexDirection="column" 
        position="relative"
        bg="#18181B"
        borderLeft="1px solid #27272A"
      >
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
              left="72px"
              width="300px"
              height="100%"
              bg="#18181B"
              borderRight="1px solid #27272A"
              p={4}
              onClick={e => e.stopPropagation()}
            >
              <Text fontSize="lg" fontWeight="bold" mb={4} color="#E4E4E7">
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
                    leftIcon={<MessageSquareIcon size={20} />}
                    justifyContent="flex-start"
                    w="100%"
                    height="40px"
                    bg={currentConversation?.id === conv.id ? "#0064E0" : "#27272A"}
                    color="#E4E4E7"
                    _hover={{
                      bg: "#0064E0",
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 8px rgba(0, 100, 224, 0.25)"
                    }}
                  >
                    <Text isTruncated>
                      {conv.title || "Nova Conversa"}
                    </Text>
                  </Button>
                ))}
                <Divider borderColor="#27272A" />
                <Button
                  bg="#0064E0"
                  color="#E4E4E7"
                  _hover={{
                    bg: "#0052B8",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(0, 100, 224, 0.25)"
                  }}
                  onClick={() => {
                    createConversation();
                    onClose();
                  }}
                  leftIcon={<Plus size={20} />}
                  height="40px"
                >
                  Nova Conversa
                </Button>
              </VStack>
            </Box>
          </Box>
        )}

        {/* Main Chat Area */}
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          bg="#18181B"
        >
          {/* Chat Header */}
          <Box
            height="64px"
            px={4}
            borderBottom="1px solid #27272A"
            bg="#18181B"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Text 
                fontWeight="semibold" 
                fontSize="lg" 
                lineHeight="24px"
                height="24px"
                color={selectedCustomerData ? "#E4E4E7" : "#71717A"}
              >
                {getCustomerName(selectedCustomerData) || 'Selecione um cliente'}
              </Text>
              <Text
                fontSize="sm"
                lineHeight="16px"
                height="16px"
                color="#71717A"
              >
                {selectedCustomerData?.type === 'google_ads' ? 'Google Ads' : selectedCustomerData?.type === 'meta_ads' ? 'Meta Ads' : ''}
              </Text>
            </Box>
            <Image
              src="/logo.svg"
              alt="Logo"
              height="40px"
              objectFit="contain"
            />
          </Box>

          {/* Messages Area */}
          <Box
            flex="1"
            overflowY="auto"
            px={4}
            py={6}
            display="flex"
            flexDirection="column"
            gap={4}
            bg="#18181B"
          >
            {sortedMessages.map((message: ChatMessage) => (
              <Box
                key={message.id}
                alignSelf={message.role === "assistant" ? "flex-start" : "flex-end"}
                maxW={{ base: "90%", md: "70%" }}
              >
                <Box
                  p={4}
                  bg={message.role === 'assistant' ? '#27272A' : '#0064E0'}
                  color="#E4E4E7"
                  borderRadius="lg"
                  boxShadow={message.role === 'assistant' 
                    ? "0 2px 8px rgba(0, 0, 0, 0.2)"
                    : "0 2px 8px rgba(0, 100, 224, 0.25)"
                  }
                >
                  <ReactMarkdown className="markdown-content">
                    {typeof message.content === 'string' ? message.content : message.content.join('\n')}
                  </ReactMarkdown>
                </Box>
              </Box>
            ))}
            {loading && (
              <Box alignSelf="flex-start" maxW={{ base: "90%", md: "70%" }}>
                <Box
                  bg="#27272A"
                  color="#E4E4E7"
                  px={4}
                  py={3}
                  borderRadius="lg"
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.2)"
                >
                  <Text>
                    Processando...
                  </Text>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Bottom Area */}
          <Box
            bg="#18181B"
            borderTop="1px solid #27272A"
          >
            <Box
              display="flex"
              flexDirection="column"
              transition="all 0.2s ease-in-out"
            >
              {/* Input Area */}
              <Box 
                p={4}
                pt={2}
              >
                <form onSubmit={handleSubmit}>
                  <HStack spacing={2} align="flex-end">
                    <Box flex={1}>
                      <Textarea
                        ref={textareaRef}
                        placeholder="Digite sua mensagem..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        resize="none"
                        minH="40px"
                        h="40px"
                        maxH="216px"
                        py={2}
                        px={3}
                        lineHeight="20px"
                        borderRadius="md"
                        bg="#27272A"
                        color="#E4E4E7"
                        border="1px solid #3F3F46"
                        _placeholder={{ color: "#71717A" }}
                        _hover={{ borderColor: "#52525B" }}
                        _focus={{
                          borderColor: "#52525B",
                          boxShadow: "0 0 0 1px #52525B"
                        }}
                        sx={{
                          '&::-webkit-scrollbar': {
                            width: '4px',
                            display: 'none'
                          },
                          '&:hover::-webkit-scrollbar': {
                            display: 'block'
                          },
                          '&::-webkit-scrollbar-track': {
                            background: 'transparent'
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '2px'
                          },
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent'
                        }}
                      />
                    </Box>
                    <IconButton
                      type="submit"
                      aria-label="Enviar mensagem"
                      icon={<Send size={20} />}
                      isDisabled={!input.trim()}
                      bg={input.trim() ? "#FF8A00" : "#27272A"}
                      color="#E4E4E7"
                      _hover={{
                        bg: "#E67A00",
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 8px rgba(255, 138, 0, 0.25)"
                      }}
                      _disabled={{
                        bg: "#27272A",
                        opacity: 0.7,
                        cursor: "not-allowed",
                        _hover: {
                          bg: "#27272A",
                          transform: "none",
                          boxShadow: "none"
                        }
                      }}
                      size="md"
                      borderRadius="md"
                    />
                  </HStack>
                </form>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
