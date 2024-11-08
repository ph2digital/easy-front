// src/store/campaignSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Campaign } from '../types';

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
    },
});

export const { fetchCampaignsStart, fetchCampaignsSuccess, fetchCampaignsFailure } = campaignSlice.actions;
export default campaignSlice.reducer;
