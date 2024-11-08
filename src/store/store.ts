// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import campaignReducer from './campaignSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    campaign: campaignReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
