
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedCustomersState {
    selectedCustomers: string[];
}

const initialState: SelectedCustomersState = {
    selectedCustomers: [],
};

const selectedCustomersSlice = createSlice({
    name: 'selectedCustomers',
    initialState,
    reducers: {
        addCustomer(state, action: PayloadAction<string>) {
            state.selectedCustomers.push(action.payload);
        },
        removeCustomer(state, action: PayloadAction<string>) {
            state.selectedCustomers = state.selectedCustomers.filter(id => id !== action.payload);
        },
        setCustomers(state, action: PayloadAction<string[]>) {
            state.selectedCustomers = action.payload;
        },
    },
});

export const { addCustomer, removeCustomer, setCustomers } = selectedCustomersSlice.actions;
export default selectedCustomersSlice.reducer;