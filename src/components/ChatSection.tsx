import React, { RefObject } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  Avatar,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: number;
}

interface ChatSectionProps {
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  messagesEndRef: RefObject<HTMLDivElement>;
  userName?: string;
  userAvatar?: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onKeyPress,
  messagesEndRef,
  userName,
  userAvatar,
}) => {
  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const messageBgColor = useColorModeValue('white', 'gray.700');
  const userMessageBgColor = useColorModeValue('blue.500', 'blue.400');
  const headingColor = useColorModeValue('gray.700', 'white');

  return (
    <Box
      bg={bgCard}
      borderRadius="lg"
      boxShadow="lg"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        boxShadow: 'xl',
      }}
      height={{ base: "calc(100vh - 280px)", md: "600px" }}
      display="flex"
      flexDirection="column"
    >
      <Flex p={6} borderBottom="1px" borderColor={borderColor} align="center">
        <Heading size="md" color={headingColor}>Chat Assistant</Heading>
      </Flex>

      <Box
        flex="1"
        overflowY="auto"
        p={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('gray.400', 'gray.600'),
            borderRadius: '24px',
          },
        }}
      >
        {messages.map((message) => (
          <Flex
            key={message.id}
            justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
            mb={4}
          >
            {message.role === 'assistant' && (
              <Avatar
                size="sm"
                mr={2}
                name="AI Assistant"
                src="/assistant-avatar.png"
              />
            )}
            <Box
              maxW={{ base: "75%", md: "70%" }}
              bg={message.role === 'user' ? userMessageBgColor : messageBgColor}
              color={message.role === 'user' ? 'white' : textColor}
              p={3}
              borderRadius="lg"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <Text whiteSpace="pre-wrap">{message.content}</Text>
            </Box>
            {message.role === 'user' && (
              <Avatar
                size="sm"
                ml={2}
                name={userName || 'User'}
                src={userAvatar}
              />
            )}
          </Flex>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box p={4} borderTop="1px" borderColor={borderColor}>
        <Flex gap={2}>
          <Input
            value={newMessage}
            onChange={onNewMessageChange}
            onKeyPress={onKeyPress}
            placeholder="Digite sua mensagem..."
            size="lg"
            bg={messageBgColor}
            border="1px"
            borderColor={borderColor}
            borderRadius="full"
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
            }}
          />
          <IconButton
            aria-label="Send message"
            icon={<Send />}
            onClick={onSendMessage}
            size="lg"
            colorScheme="blue"
            isDisabled={!newMessage.trim()}
            borderRadius="full"
            _hover={{
              transform: 'translateY(-1px)',
            }}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ChatSection;
