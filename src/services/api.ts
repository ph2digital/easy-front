// src/services/api.ts
import axios from 'axios';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store/index';
// import { json } from 'react-router-dom';

// Import mock functions
import { getMockCampaigns, getMockAdAccounts, getMockGoogleAdsAccounts, getMockFacebookAdAccounts, getMockCampaignDetails, getMockAdsetDetails, getMockAdDetails, getMockFullAdDetails, getMockCampaignInsights, getMockAdsetInsights, getMockAdInsights, getMockCustomAudiences, getMockAudience, getMockCreativeFiles, getMockCreativeBasedOnCompetitor } from './mockData';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});
const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'default-auth-token';
const USER_KEY = 'user';
const APP_STATE_KEY = 'app-state';

const isValidJSON = (str: string | null) => {
    if (!str) return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

// Função para obter sessão do token local armazenado
export const getSessionFromLocalStorage = () => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (isValidJSON(storedToken) && isValidJSON(storedUser)) {
        return {
            ...JSON.parse(storedToken!),
            user: JSON.parse(storedUser!),
        };
    }
    return null;
};

// Função para configurar sessão no localStorage
export const setSession = (accessToken: string, refreshToken: string, user: any, appState: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(appState));
};

// Função para limpar sessão local
export const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(APP_STATE_KEY);
};

// Função para obter o email do usuário da sessão
export const getUserEmailFromSession = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).email : null;
};

// Outros métodos
export const logoutUser = async (dispatch: AppDispatch) => {
    try {
        await axios.post(`${API_URL}/auth/logout`);
        clearSession();
        dispatch(logout());
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
};

export const signInWithGoogle = async () => {
    console.log('Mock signInWithGoogle called');
    const mockAccessToken = 'mockGoogleAccessToken';
    const mockRefreshToken = 'mockGoogleRefreshToken';
    const mockUser = {
        id: 'mockGoogleUserId',
        email: 'mockgoogleuser@example.com',
        picture: 'mockGoogleProfileImageUrl',
    };
    setSession(mockAccessToken, mockRefreshToken, mockUser, {});
    window.location.href = '/home';
};

export const saveGoogleSessionToDatabase = async (accessToken: string, refreshToken: string) => {
    console.log('Mock saveGoogleSessionToDatabase called');
    const mockUser = {
        id: 'mockGoogleUserId',
        email: 'mockgoogleuser@example.com',
        picture: 'mockGoogleProfileImageUrl',
    };
    setSession(accessToken, refreshToken, mockUser, {});
    return { user: mockUser, appState: {} };
};

export const saveMetaSessionToDatabase = async (accessToken: string) => {
    console.log('Mock saveMetaSessionToDatabase called');
    const mockUser = {
        id: 'mockMetaUserId',
        email: 'mockmetauser@example.com',
        picture: 'mockMetaProfileImageUrl',
    };
    setSession(accessToken, '', mockUser, {});
    return { user: mockUser, appState: {} };
};

export const saveFacebookSessionToDatabase = async (accessToken: string) => {
    console.log('Mock saveFacebookSessionToDatabase called');
    const mockUser = {
        id: 'mockFacebookUserId',
        email: 'mockfacebookuser@example.com',
        picture: 'mockFacebookProfileImageUrl',
    };
    setSession(accessToken, '', mockUser, {});
    return { user: mockUser, appState: {} };
};

export const validateToken = async () => {
    console.log('Mock validateToken called');
    return { valid: true };
};

export const linkMetaAds = () => {
    console.log('Mock linkMetaAds called');
    const mockAccessToken = 'mockFacebookAccessToken';
    const mockUser = {
        id: 'mockFacebookUserId',
        email: 'mockfacebookuser@example.com',
        picture: 'mockFacebookProfileImageUrl',
    };
    setSession(mockAccessToken, '', mockUser, {});
    window.location.href = '/home';
};

// Replace mock implementations with function calls
export const fetchGoogleAdsAccounts = async (_accessToken: string, _userId: any) => {
    console.log('fetchGoogleAdsAccounts - Fetching Google Ads accounts for userId:', _userId);
    return getMockGoogleAdsAccounts();
};

export const fetchFacebookAdAccounts = async (_accessToken: string, _userId: any) => {
    console.log('fetchFacebookAdAccounts - Fetching Facebook Ad accounts for userId:', _userId);
    return getMockFacebookAdAccounts();
};

export const fetchMetaAdsCampaigns = async (_accessToken: string, _p0: any) => {
    console.log('fetchMetaAdsCampaigns - Fetching Meta Ads campaigns for accessToken:', _accessToken);
    return getMockCampaigns(_accessToken);
};

export const fetchMetaAdsAdsets = async (_accessToken: string, _campaignId: string) => {
    console.log('fetchMetaAdsAdsets - Fetching Meta Ads adsets for campaignId:', _campaignId);
    return getMockAdAccounts();
};

export const fetchMetaAdsAds = async (_accessToken: string, _adsetId: string) => {
    console.log('fetchMetaAdsAds - Fetching Meta Ads ads for adsetId:', _adsetId);
    return getMockAdAccounts();
};

export const fetchMetaAdsCampaignDetails = async (_accessToken: string, campaignId: string) => {
    console.log('fetchMetaAdsCampaignDetails - Fetching Meta Ads campaign details for campaignId:', campaignId);
    return getMockCampaignDetails(campaignId);
};

export const fetchMetaAdsAdsetDetails = async (_accessToken: string, _adsetId: string) => {
    console.log('fetchMetaAdsAdsetDetails - Fetching Meta Ads adset details for adsetId:', _adsetId);
    return getMockAdsetDetails();
};

export const fetchMetaAdsAdDetails = async (_accessToken: string, _adId: string) => {
    console.log('fetchMetaAdsAdDetails - Fetching Meta Ads ad details for adId:', _adId);
    return getMockAdDetails();
};

export const fetchMetaAdsFullAdDetails = async (_accessToken: string, _adId: string) => {
    console.log('fetchMetaAdsFullAdDetails - Fetching Meta Ads full ad details for adId:', _adId);
    return getMockFullAdDetails();
};

export const fetchMetaAdsCampaignInsights = async (_accessToken: string, _campaignId: string) => {
    console.log('fetchMetaAdsCampaignInsights - Fetching Meta Ads campaign insights for campaignId:', _campaignId);
    return getMockCampaignInsights();
};

export const fetchMetaAdsAdsetInsights = async (_accessToken: string, _adsetId: string) => {
    console.log('fetchMetaAdsAdsetInsights - Fetching Meta Ads adset insights for adsetId:', _adsetId);
    return getMockAdsetInsights();
};

export const fetchMetaAdsAdInsights = async (_accessToken: string, _adId: string) => {
    console.log('fetchMetaAdsAdInsights - Fetching Meta Ads ad insights for adId:', _adId);
    return getMockAdInsights();
};

export const fetchCustomAudiences = async (_access_token: string, _customerId: string) => {
    console.log('fetchCustomAudiences - Fetching custom audiences for customerId:', _customerId);
    return getMockCustomAudiences();
};

export const createCustomAudience = async (_accessToken: string, _adAccountId: string, audienceData: any) => {
    console.log('createCustomAudience - Creating custom audience for adAccountId:', _adAccountId);
    return getMockAudience(audienceData);
};

export const uploadCreativeFiles = async (_accessToken: string, _customerId: string, _files: File[], _pageId: string, _link: string, _message: string) => {
    console.log('uploadCreativeFiles - Uploading creative files for customerId:', _customerId);
    return getMockCreativeFiles();
};

export const requestCreativeBasedOnCompetitor = async (_accessToken: string, _competitorAdId: string) => {
    console.log('requestCreativeBasedOnCompetitor - Requesting creative based on competitor for competitorAdId:', _competitorAdId);
    return getMockCreativeBasedOnCompetitor();
};

export const createMetaAdsCampaign = async (_accessToken: string, campaignData: any) => {
    console.log('createMetaAdsCampaign - Creating Meta Ads campaign with data:', campaignData);
    return { ...campaignData, id: 'mockCampaignId' };
};

export const createFacebookBusinessManager = async (_accessToken: string, _userId: string, businessData: any) => {
    console.log('createFacebookBusinessManager - Creating Facebook Business Manager with data:', businessData);
    return { ...businessData, id: 'mockBusinessId' };
};

export const createFacebookAdAccount = async (_accessToken: string, _businessId: string, adAccountData: any) => {
    console.log('createFacebookAdAccount - Creating Facebook Ad Account with data:', adAccountData);
    return { ...adAccountData, id: 'mockAdAccountId' };
};

export const createMetaAdsAd = async (_accessToken: string, adData: any) => {
    console.log('createMetaAdsAd - Creating Meta Ads ad with data:', adData);
    return { ...adData, id: 'mockAdId' };
};

export const createCampaign = async (_accessToken: string, campaignData: any) => {
    console.log('createCampaign - Creating campaign with data:', campaignData);
    return { ...campaignData, id: 'mockCampaignId' };
};

export const updateMetaAdsCampaign = async (campaignId: string, campaignData: any) => {
    console.log('updateMetaAdsCampaign - Updating Meta Ads campaign with id:', campaignId);
    return { ...campaignData, id: campaignId };
};

export const createGuidedCampaign = async (_accessToken: string, campaignData: any) => {
    console.log('createGuidedCampaign - Creating guided campaign with data:', campaignData);
    return { ...campaignData, id: 'mockGuidedCampaignId' };
};

export const createAutomaticCampaign = async (_accessToken: string, campaignData: any) => {
    console.log('createAutomaticCampaign - Creating automatic campaign with data:', campaignData);
    return { ...campaignData, id: 'mockAutomaticCampaignId' };
};

export const createAdSet = async (_accessToken: string, adSetData: any) => {
    console.log('createAdSet - Creating ad set with data:', adSetData);
    return { ...adSetData, id: 'mockAdSetId' };
};

export const createAd = async (_accessToken: string, adData: any) => {
    console.log('createAd - Creating ad with data:', adData);
    return { ...adData, id: 'mockAdId' };
};

export const updateMetaAdsAdset = async (adsetId: string, adsetData: any, accessToken?: string) => {
    console.log('updateMetaAdsAdset - Updating Meta Ads adset with id:', adsetId);
    return { ...adsetData, id: adsetId };
};

export const linkAccountFromHome = async (_platform: string, _userId: any) => {
    console.log('linkAccountFromHome - Linking account from home for platform:', _platform);
    return 'mockAuthUrl';
};

export default api;
