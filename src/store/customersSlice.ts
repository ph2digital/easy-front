import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { AppThunk } from './store';
import { listCustomers } from '../services/api';

interface Customer {
  id: string;
  customer_id: string;
  type: 'google_ads' | 'meta_ads';
  is_active: boolean;
  accountdetails_name: string | null;
  accountdetails_business_name: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CustomersState {
  linked_customers: Customer[];
  loading: boolean;
  lastFetched: number | null;
}

const initialState: CustomersState = {
  linked_customers: [],
  loading: false,
  lastFetched: null
};

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.linked_customers = action.payload;
      state.loading = false;
      state.lastFetched = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.linked_customers.push(action.payload);
    },
    removeCustomer: (state, action: PayloadAction<string>) => {
      state.linked_customers = state.linked_customers.filter(customer => customer.id !== action.payload);
    },
  },
});

export const { setCustomers, setLoading, addCustomer, removeCustomer } = customersSlice.actions;

// Thunk action to fetch customers
export const fetchCustomers = (userId: string): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const lastFetched = state.customers.lastFetched;
  const loading = state.customers.loading;
  
  // If already loading or fetched within last 5 minutes, skip
  if (loading || (lastFetched && Date.now() - lastFetched < 5 * 60 * 1000)) {
    return;
  }

  dispatch(setLoading(true));
  try {
    const data = await listCustomers(userId);
    dispatch(setCustomers(data));
  } catch (error) {
    console.error('Error fetching customers:', error);
    dispatch(setLoading(false));
  }
};

export const selectCustomers = (state: RootState) => state.customers.linked_customers;
export const selectGoogleCustomers = (state: RootState) => 
  state.customers.linked_customers.filter(customer => customer.type === 'google_ads');
export const selectMetaCustomers = (state: RootState) => 
  state.customers.linked_customers.filter(customer => customer.type === 'meta_ads');
export const selectCustomersLoading = (state: RootState) => state.customers.loading;

export default customersSlice.reducer;
