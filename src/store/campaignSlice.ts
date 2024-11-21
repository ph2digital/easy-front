// src/store/campaignSlice.ts

// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Campaign } from '../types';

// Define the initial state using that type
interface CampaignState {
    campaigns: Campaign[];
    loading: boolean;
    error: string | null;
}

const initialState: CampaignState = {
    campaigns: [],
    loading: false,
    error: null,
};

// Create a slice of the store
const campaignSlice = createSlice({
    name: 'campaigns',
    initialState,
    reducers: {
        fetchCampaignsStart(state) {
            state.loading = true;
        },
        fetchCampaignsSuccess(state, action: PayloadAction<Campaign[]>) {
            state.campaigns = action.payload;
            state.loading = false;
        },
        fetchCampaignsFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        },
        createCampaign(state, action: PayloadAction<Campaign>) {
            state.campaigns.push(action.payload);
        },
    },
});

// Export the actions and reducer
export const { fetchCampaignsStart, fetchCampaignsSuccess, fetchCampaignsFailure, createCampaign } = campaignSlice.actions;
export default campaignSlice.reducer;
