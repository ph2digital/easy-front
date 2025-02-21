import { create } from 'zustand';

interface Message {
  id: string;
  content: string[];
  role: 'user' | 'assistant';
  created_at: number;
  thread_id: string;
}

interface Conversation {
  id: string;
  title?: string;
  threadId?: string;
  messages?: Message[];
  created_at: number;
  updated_at: number;
}

interface ChatStore {
  messages: Message[];
  loading: boolean;
  currentConversation: Conversation | null;
  conversations: Conversation[];
  sendMessage: (message: string) => Promise<void>;
  createConversation: () => Promise<void>;
  setCurrentConversation: (conversation: Conversation) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  loading: false,
  currentConversation: null,
  conversations: [],
  sendMessage: async (message: string) => {
    set({ loading: true });
    try {
      // Implement your message sending logic here
      const newMessage: Message = {
        id: Date.now().toString(),
        content: [message],
        role: 'user',
        created_at: Date.now(),
        thread_id: 'temp-thread'
      };
      set((state) => ({ messages: [...state.messages, newMessage] }));
      
      // Simulate API response
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          content: ['This is a simulated response'],
          role: 'assistant',
          created_at: Date.now(),
          thread_id: 'temp-thread'
        };
        set((state) => ({ 
          messages: [...state.messages, response],
          loading: false
        }));
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      set({ loading: false });
    }
  },
  createConversation: async () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      created_at: Date.now(),
      updated_at: Date.now()
    };
    set((state) => ({
      conversations: [...state.conversations, newConversation],
      currentConversation: newConversation
    }));
  },
  setCurrentConversation: (conversation: Conversation) => {
    set({ currentConversation: conversation });
  }
}));
