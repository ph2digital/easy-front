// src/store/index.ts

// Import necessary functions and reducers
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer, { validateToken } from './authSlice';
import campaignReducer from './campaignSlice';
import selectedCustomersReducer from './selectedCustomersSlice';
import customersReducer from './customersSlice';
import threadsReducer from './threadsSlice';

// Configure the store with the reducers
const store = configureStore({
    reducer: {
        auth: authReducer,
        campaigns: campaignReducer,
        selectedCustomers: selectedCustomersReducer,
        customers: customersReducer,
        threads: threadsReducer,
    },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create a custom hook for typed dispatch
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export { validateToken };

export default store;
