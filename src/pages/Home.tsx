import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { fetchCampaigns } from '../services/api';
import { selectUser } from '../store/authSlice';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState([]);
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

  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const headingColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    const loadCampaigns = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await fetchCampaigns(user.id);
          setCampaigns(response);
        } catch (error) {
          setError('Failed to load campaigns');
        } finally {
          setLoading(false);
        }
      }
    };
    loadCampaigns();
  }, [user]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCustomerName') {
        setSelectedCustomerName(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Também verifica mudanças diretas no localStorage
    const checkLocalStorage = () => {
      const currentName = localStorage.getItem('selectedCustomerName');
      if (currentName !== selectedCustomerName) {
        setSelectedCustomerName(currentName);
      }
    };

    const interval = setInterval(checkLocalStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedCustomerName]);

  useEffect(() => {
    const name = localStorage.getItem('selectedCustomerName');
    setSelectedCustomerName(name);
  }, [selectedAccount]);

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
      const response = await fetch(`http://localhost:8080/api/gpt/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: newMessage,
          userId: user.id,
          activeThread: currentThread?.id || null,
          selectedAccount,
          accessToken: null,
          customerGestor: null,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get response reader');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
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
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.slice(0, -1));
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
