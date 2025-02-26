import React from 'react';
import {
  Box,
  VStack,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
  Badge,
  Divider,
  Button,
} from '@chakra-ui/react';
import { MessageSquare, User, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store';
import { selectThreads, createThread } from '../store/threadsSlice';
import type { Thread } from '../store/threadsSlice';
import { formatDistanceToNow, isValid, isToday, isWithinInterval, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConversationListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (thread: Thread | null) => void;
}

interface GroupedThreads {
  today: Thread[];
  lastWeek: Thread[];
  lastMonth: Thread[];
  older: Thread[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  isOpen,
  onClose,
  onSelectConversation,
}) => {
  const threads = useAppSelector(selectThreads);
  const dispatch = useAppDispatch();
  const bgHover = useColorModeValue('gray.100', 'gray.700');
  const badgeBg = useColorModeValue('blue.100', 'blue.800');
  const dividerColor = useColorModeValue('gray.200', 'gray.700');

  const groupThreadsByDate = (threads: Thread[]): GroupedThreads => {
    const now = new Date();
    const oneWeekAgo = subDays(now, 7);
    const oneMonthAgo = subDays(now, 30);

    return threads.reduce(
      (groups, thread) => {
        const date = new Date(thread.created_at);
        if (isToday(date)) {
          groups.today.push(thread);
        } else if (isWithinInterval(date, { start: oneWeekAgo, end: now })) {
          groups.lastWeek.push(thread);
        } else if (isWithinInterval(date, { start: oneMonthAgo, end: oneWeekAgo })) {
          groups.lastMonth.push(thread);
        } else {
          groups.older.push(thread);
        }
        return groups;
      },
      { today: [], lastWeek: [], lastMonth: [], older: [] } as GroupedThreads
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (!isValid(date)) {
      return 'Data inválida';
    }
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const renderThreadGroup = (title: string, threads: Thread[]) => {
    if (threads.length === 0) return null;

    return (
      <Box>
        <Text px={4} py={2} fontWeight="bold" fontSize="sm" color="gray.500">
          {title}
        </Text>
        {threads.map((thread) => (
          <Box
            key={thread.id}
            p={4}
            cursor="pointer"
            _hover={{ bg: bgHover }}
            onClick={() => {
              onSelectConversation(thread);
              onClose();
            }}
            borderBottomWidth="1px"
          >
            <Box display="flex" alignItems="center" mb={2}>
              <MessageSquare size={20} style={{ marginRight: '8px' }} />
              <Text fontWeight="bold" flex="1">
                {thread.metadata.title}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {formatDate(thread.updated_at)}
              </Text>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              {thread.metadata.gestor_id && (
                <Badge bg={badgeBg} display="flex" alignItems="center" gap={1}>
                  <User size={12} />
                  <Text fontSize="xs">Gestor: {thread.metadata.gestor_id}</Text>
                </Badge>
              )}
              {thread.status && (
                <Badge colorScheme={thread.status === 'active' ? 'green' : 'gray'}>
                  {thread.status}
                </Badge>
              )}
            </Box>
          </Box>
        ))}
        <Divider borderColor={dividerColor} />
      </Box>
    );
  };

  const handleNewConversation = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const selectedCustomer = localStorage.getItem('selectedCustomer') || '';
      const selectedCustomerName = localStorage.getItem('selectedCustomerName') || '';
      const selectedCustomerType = localStorage.getItem('selectedCustomerType') || '';
      const selectedAccount = localStorage.getItem('selectedAccount') || '';
      const customerGestor = localStorage.getItem('customerGestor') || '';
      
      // Find active customer details
      const activeCustomers = JSON.parse(localStorage.getItem('activeCustomers') || '[]');
      const selectedCustomerDetails = activeCustomers.find(
        (customer: any) => customer.customer_id === selectedAccount
      );

      const payload = {
        prompt: '',
        userId: userData.id,
        customerId: selectedCustomer,
        customerGestor,
        metadata: {
          title: `Nova Conversa - ${selectedCustomerName}`,
          userId: userData.id,
          customerId: selectedCustomer,
          gestorId: customerGestor,
          customerName: selectedCustomerName,
          customerType: selectedCustomerType,
          accountId: selectedAccount,
          accountName: selectedCustomerDetails?.accountdetails_name || ''
        }
      };

      const result = await dispatch(createThread(payload)).unwrap();
      onSelectConversation(result);
      onClose();
    } catch (error) {
      console.error('Failed to create new thread:', error);
    }
  };

  const groupedThreads = groupThreadsByDate(threads);

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <Text mb={4}>Conversas</Text>
          <Button
            leftIcon={<Plus size={16} />}
            colorScheme="blue"
            size="sm"
            onClick={handleNewConversation}
            width="100%"
          >
            Nova Conversa
          </Button>
        </DrawerHeader>
        <DrawerBody p={0}>
          <VStack spacing={0} align="stretch">
            {threads.length === 0 ? (
              <Box p={4}>
                <Text color="gray.500">Nenhuma conversa encontrada</Text>
              </Box>
            ) : (
              <>
                {renderThreadGroup('Hoje', groupedThreads.today)}
                {renderThreadGroup('Últimos 7 dias', groupedThreads.lastWeek)}
                {renderThreadGroup('Último mês', groupedThreads.lastMonth)}
                {renderThreadGroup('Mais antigas', groupedThreads.older)}
              </>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ConversationList;
