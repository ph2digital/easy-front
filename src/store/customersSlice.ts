import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

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
}

const initialState: CustomersState = {
  linked_customers: []
};

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<{ linked_customers: Customer[] }>) => {
      state.linked_customers = action.payload.linked_customers;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.linked_customers.push(action.payload);
    },
    removeCustomer: (state, action: PayloadAction<string>) => {
      state.linked_customers = state.linked_customers.filter(customer => customer.id !== action.payload);
    },
  },
});

export const { setCustomers, addCustomer, removeCustomer } = customersSlice.actions;

export const selectCustomers = (state: RootState) => state.customers.linked_customers;
export const selectGoogleCustomers = (state: RootState) => 
  state.customers.linked_customers.filter(customer => customer.type === 'google_ads');
export const selectMetaCustomers = (state: RootState) => 
  state.customers.linked_customers.filter(customer => customer.type === 'meta_ads');

export default customersSlice.reducer;
