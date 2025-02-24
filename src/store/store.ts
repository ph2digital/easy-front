import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import customersReducer from './customersSlice';
import threadsReducer from './threadsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    threads: threadsReducer,
  },
});

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
