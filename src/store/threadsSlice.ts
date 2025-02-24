import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { AppThunk } from './store';
import { createThread as createThreadAPI, fetchThreads, sendChatMessage } from '../services/api';

interface ThreadMetadata {
  title?: string;
  user_id?: string;
  customer_id?: string;
  gestor_id?: string;
}

export interface Thread {
  id: string;
  created_at: number;
  updated_at: number;
  status: string;
  metadata: ThreadMetadata;
  messages?: any[];
  object: string;
  tool_resources: Record<string, any>;
}

interface ThreadsState {
  threads: Thread[];
  loading: boolean;
  lastFetched: number | null;
}

const initialState: ThreadsState = {
  threads: [],
  loading: false,
  lastFetched: null
};

// Create thread thunk
export const createThread = createAsyncThunk(
  'threads/createThread',
  async (params: {
    prompt: string;
    userId: string;
    customerId: string;
    customerGestor: string;
  }) => {
    const metadata = {
      title: params.prompt,
      user_id: params.userId,
      customer_id: params.customerId,
      gestor_id: params.customerGestor
    };
    const response = await createThreadAPI(
      params.prompt,
      params.userId,
      params.customerId,
      params.customerGestor,
      metadata
    );
    return response;
  }
);

// Send message thunk
export const sendMessage = createAsyncThunk(
  'threads/sendMessage',
  async (params: {
    content: string;
    threadId: string;
    metadata: ThreadMetadata;
  }) => {
    const response = await sendChatMessage(
      params.content,
      params.threadId,
      params.metadata
    );
    return response;
  }
);

export const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setThreads: (state, action: PayloadAction<Thread[]>) => {
      state.threads = action.payload;
      state.loading = false;
      state.lastFetched = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.unshift(action.payload);
    },
    updateThread: (state, action: PayloadAction<Thread>) => {
      const index = state.threads.findIndex(thread => thread.id === action.payload.id);
      if (index !== -1) {
        state.threads[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createThread.pending, (state) => {
        state.loading = true;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.unshift(action.payload);
      })
      .addCase(createThread.rejected, (state) => {
        state.loading = false;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const threadIndex = state.threads.findIndex(t => t.id === action.payload.thread_id);
        if (threadIndex !== -1) {
          state.threads[threadIndex].messages = action.payload.messages;
        }
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { setThreads, setLoading, addThread, updateThread } = threadsSlice.actions;

// Thunk action to fetch threads
export const fetchThreadsList = (userId: string): AppThunk => async dispatch => {
  try {
    dispatch(setLoading(true));
    const threads = await fetchThreads(userId);
    dispatch(setThreads(threads));
  } catch (error) {
    console.error('Error fetching threads:', error);
    dispatch(setLoading(false));
  }
};

export const selectThreads = (state: RootState) => state.threads.threads;
export const selectThreadsLoading = (state: RootState) => state.threads.loading;

export default threadsSlice.reducer;
