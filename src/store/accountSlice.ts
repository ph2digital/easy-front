import { createSlice as reduxCreateSlice } from '@reduxjs/toolkit';
import { createAsyncThunk as reduxCreateAsyncThunk } from '@reduxjs/toolkit';

// other imports and code

const initialState = {
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
  
  );export const accountReducer = accountSlice.reducer;

function createSlice(options: {
    name: string;
    initialState: { accountName: string; platform: string; };
    reducers: {
        updateAccount: (state: any, action: any) => void;
    };
}) {
    return reduxCreateSlice(options);
}

function createAsyncThunk(typePrefix: string, payloadCreator: (accountData: { accountName: string; platform: string }) => Promise<void>) {
    return reduxCreateAsyncThunk(typePrefix, payloadCreator);
}