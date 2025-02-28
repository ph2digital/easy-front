import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { getGPTResponseStream } from '../services/api';
import {
  Box,
  Container,
  Input,
  Button,
  VStack,
  Text,
  useColorModeValue,
  useToast,
  Flex,
} from '@chakra-ui/react';
import './Chat.css';

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

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'initial',
    content: 'Olá! Eu sou seu assistente virtual. Como posso ajudar você hoje?',
    role: 'assistant',
    created_at: Date.now()
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const user = useSelector(selectUser);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const userMessageBg = useColorModeValue('blue.50', 'blue.900');
  const assistantMessageBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || isLoading) return;

    setIsLoading(true);
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
      const selectedCustomer = localStorage.getItem('selectedCustomer') || null;

      await getGPTResponseStream(
        newMessage,
        user.id,
        null, // No thread for standalone chat
        selectedCustomer,
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxW="container.xl" h="100vh" py={4}>
      <Box
        h="full"
        bg={bgColor}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box flex="1" overflowY="auto" p={4}>
          <VStack spacing={4} align="stretch">
            {messages.map((message) => (
              <Box
                key={message.id}
                bg={message.role === 'user' ? userMessageBg : assistantMessageBg}
                p={4}
                borderRadius="lg"
                alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                maxW="80%"
              >
                <Text whiteSpace="pre-wrap">{message.content}</Text>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
        <Box p={4} borderTop="1px" borderColor={borderColor}>
          <Flex>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              mr={2}
              disabled={isLoading}
            />
            <Button
              colorScheme="blue"
              onClick={handleSendMessage}
              isLoading={isLoading}
              loadingText="Enviando..."
            >
              Enviar
            </Button>
          </Flex>
        </Box>
      </Box>
    </Container>
  );
};

export default Chat;
