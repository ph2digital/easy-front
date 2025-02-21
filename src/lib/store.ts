import { create } from 'zustand';

export interface Message {
  id: string;
  content: string[];
  role: 'user' | 'assistant';
  created_at: number;
  thread_id: string;
}

export interface Conversation {
  id: string;
  title?: string;
  threadId?: string;
  messages?: Message[];
  created_at: number;
  updated_at: number;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  model: string;
  setModel: (model: string) => void;
  setCurrentConversation: (conversation: Conversation) => void;
  createConversation: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>(set => ({
  messages: [],
  loading: false,
  conversations: [],
  currentConversation: null,
  model: 'gpt-3.5-turbo',
  setModel: (model: string) => set({ model }),
  setCurrentConversation: (conversation: Conversation) => {
    set({ 
      currentConversation: conversation,
      messages: conversation.messages || []
    });
  },
  createConversation: async () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      created_at: Date.now(),
      updated_at: Date.now()
    };
    set(state => ({
      conversations: [...state.conversations, newConversation],
      currentConversation: newConversation
    }));
  },
  sendMessage: async (content: string) => {
    set({ loading: true });
    try {
      // Implement your message sending logic here
      const newMessage: Message = {
        id: Date.now().toString(),
        content: [content],
        role: 'user',
        created_at: Date.now(),
        thread_id: 'temp-thread'
      };
      set(state => ({ messages: [...state.messages, newMessage] }));
      
      // Simulate API response
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          content: ['This is a simulated response'],
          role: 'assistant',
          created_at: Date.now(),
          thread_id: 'temp-thread'
        };
        set(state => ({ 
          messages: [...state.messages, response],
          loading: false
        }));
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      set({ loading: false });
    }
  }
}));
