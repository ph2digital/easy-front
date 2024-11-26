// src/store/index.ts

// Import necessary functions and reducers
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { validateToken } from './authSlice';
import campaignReducer from './campaignSlice';
import selectedCustomersReducer from './selectedCustomersSlice';

// Configure the store with the reducers
const store = configureStore({
    reducer: {
        auth: authReducer,
        campaigns: campaignReducer,
        selectedCustomers: selectedCustomersReducer,
        // Add any other reducers here
    },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { validateToken };

export default store;
