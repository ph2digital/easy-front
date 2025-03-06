import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'; 
import { fetchCampaigns, getGPTResponseStream, listCustomers } from '../services/api';
import { selectUser, selectGoogleAccessToken } from '../store/authSlice';
import { Thread } from '../store/threadsSlice';
import AccountSidebar from '../components/AccountSidebar';
import DashboardStats from '../components/DashboardStats';
import ChatSection from '../components/ChatSection';
import CampaignSection from '../components/CampaignSection';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users } from 'lucide-react';
import { 
  Box, 
  Container,
  Grid, 
  Heading, 
  Text, 
  Flex,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import './Home.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: number;
}

interface ChunkData {
  type: 'update';
  content: string;
}

const Home: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(localStorage.getItem('selectedCustomerName'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  
  // Chat states
  const [messages, setMessages] = useState<Message[]>([{
    id: 'initial',
    content: 'Olá! Eu sou seu assistente virtual. Como posso ajudar você hoje?',
    role: 'assistant',
    created_at: Date.now()
  }]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = useSelector(selectUser);
  const googleAccessToken = useSelector(selectGoogleAccessToken);

  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const headingColor = useColorModeValue('gray.700', 'white');

  const toast = useToast();

  const loadCampaigns = async () => {
    if (!user?.id) {
      console.log('No user found, skipping campaign load');
      return;
    }

    const selectedCustomer = localStorage.getItem('selectedCustomer');
    if (!selectedCustomer) {
      console.log('No customer selected, skipping campaign load');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchCampaigns();
      setCampaigns(response.data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setError('Falha ao carregar campanhas');
      if (axios.isAxiosError(error)) {
        console.error('Request details:', {
          method: error.config?.method,
          url: error.config?.url,
          headers: error.config?.headers,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Load campaigns when component mounts or when user/selectedCustomer changes
  useEffect(() => {
    loadCampaigns();
  }, [user]);

  // Watch for changes in selectedCustomer
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCustomer' || e.key === 'selectedCustomerName') {
        loadCampaigns();
        if (e.key === 'selectedCustomerName') {
          setSelectedCustomerName(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check for direct changes to localStorage
    const checkLocalStorage = () => {
      const currentCustomer = localStorage.getItem('selectedCustomer');
      const currentName = localStorage.getItem('selectedCustomerName');
      
      if (currentName !== selectedCustomerName) {
        setSelectedCustomerName(currentName);
        loadCampaigns();
      }
    };

    const interval = setInterval(checkLocalStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedCustomerName]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      role: 'user',
      created_at: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      created_at: Date.now(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const google = localStorage.getItem('googleAccounts');
      const parsedGoogle = google ? JSON.parse(google) : [];
      const accessToken = parsedGoogle?.[0]?.access_token || null;
      const customerGestor = localStorage.getItem('customerGestor') || null;

      await getGPTResponseStream(
        newMessage,
        user.id,
        currentThread?.id || null,
        selectedAccount,
        accessToken,
        customerGestor,
        (chunk) => {
          try {
            const data: ChunkData = JSON.parse(chunk);
            if (data.type === 'update') {
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'assistant') {
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...lastMessage,
                      content: lastMessage.content + data.content,
                    },
                  ];
                }
                return prev;
              });
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.slice(0, -1));
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const stats = [
    {
      title: 'Receita Total',
      value: 'R$ 23.456',
      change: '+2.5%',
      timeframe: 'vs. mês anterior',
      color: 'green.500',
      icon: <DollarSign size={20} />
    },
    {
      title: 'Impressões',
      value: '45.9K',
      change: '+1.2%',
      timeframe: 'vs. mês anterior',
      color: 'blue.500',
      icon: <Users size={20} />
    },
    {
      title: 'Conversões',
      value: '1.234',
      change: '+12.5%',
      timeframe: 'vs. mês anterior',
      color: 'green.500',
      icon: <ArrowUpRight size={20} />
    },
    {
      title: 'Taxa de Rejeição',
      value: '32.5%',
      change: '-0.8%',
      timeframe: 'vs. mês anterior',
      color: 'red.500',
      icon: <ArrowDownRight size={20} />
    }
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <Box height="100vh" overflow="hidden">
      <Grid
        templateColumns={{ base: "auto 1fr", md: "auto 1fr" }}
        gap={{ base: 2, md: 4 }}
        h="100vh"
      >
        {/* Sidebar */}
 
          <AccountSidebar
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            onSelectConversation={setCurrentThread}
            currentThread={currentThread}
          />


        {/* Main Content */}
        <Box overflowY="auto" p={{ base: 2, md: 4 }}>
          <Container maxW="container.xl">
            {/* Header Section */}
            <Flex 
              justify="space-between" 
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              mb={4}
              bg={bgCard}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Box mb={{ base: 4, md: 0 }}>
                <Heading size="lg" color={headingColor}>Dashboard</Heading>
                {selectedCustomerName && (
                  <Text color={textColor} fontSize="md" fontWeight="medium" mt={1}>
                    Cliente: {selectedCustomerName}
                  </Text>
                )}
              </Box>
              <Box>
                <Text color={textColor} fontSize="sm">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </Box>
            </Flex>

            {/* Dashboard Stats */}
            <DashboardStats stats={stats} />

            {/* Campaign Section */}
            <CampaignSection
              loading={loading}
              error={error}
              campaigns={campaigns}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />

            {/* Chat Section */}
            <Box mb={8}>
              <ChatSection
                messages={messages}
                newMessage={newMessage}
                onNewMessageChange={(e) => setNewMessage(e.target.value)}
                onSendMessage={handleSendMessage}
                onKeyPress={handleKeyPress}
                messagesEndRef={messagesEndRef}
                userName={user?.name}
                userAvatar={user?.picture}
              />
            </Box>
          </Container>
        </Box>
      </Grid>
    </Box>
  );
};

export default Home;
