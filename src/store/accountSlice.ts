import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// other imports and code

interface AccountState {
  accountName: string;
  platform: string;
  // ...other state properties...
}

const initialState: AccountState = {
  accountName: '',
  platform: '',
  // ...other initial state properties...
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // other reducers
    updateAccount: (state, action) => {
      const { accountName, platform } = action.payload;
      state.accountName = accountName;
      state.platform = platform;
    },
  },
});

export const updateAccount = createAsyncThunk(
  'account/updateAccount',
  async (accountData: { accountName: string; platform: string }) => {
    // Example usage of accountData
    const { accountName, platform } = accountData;
    console.log(`Account Name: ${accountName}, Platform: ${platform}`);
    // Your async logic here
  }
);

export const accountReducer = accountSlice.reducer;

// Removed redefinitions of createSlice and createAsyncThunk