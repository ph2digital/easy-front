// src/services/campaignService.ts
import api from './api';
import { Campaign } from '../types';

export const createCampaign = async (campaign: Campaign) => {
    return await api.post('/campaigns/create', campaign);
};
