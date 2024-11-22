// src/services/api.ts
import axios from 'axios';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store/index';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    withCredentials: true,
});
const API_URL = import.meta.env.VITE_API_URL || '';
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'default-auth-token';

// Função para obter sessão do token local armazenado
export const getSessionFromLocalStorage = () => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    return storedToken ? JSON.parse(storedToken) : null;
};

// Função para configurar sessão no localStorage
export const setSession = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
};

// Função para limpar sessão local
export const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('user');
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
    console.log('Iniciando o processo de login com Google...');
    try {
        const response = await axios.get(`${API_URL}/auth/google`);
        if (response.status === 200) {
            window.location.href = response.data.authUrl;
        } else {
            console.error('Erro ao iniciar o login com Google:', response.statusText);
            throw new Error('Erro ao iniciar o login com Google');
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Erro ao iniciar o login com Google:', error.response.data);
        } else if (axios.isAxiosError(error) && error.request) {
            console.error('Erro ao iniciar o login com Google: Nenhuma resposta recebida', error.request);
        } else if (error instanceof Error) {
            console.error('Erro ao iniciar o login com Google:', error.message);
        } else {
            console.error('Erro ao iniciar o login com Google:', error);
        }
        throw new Error('Erro ao iniciar o login com Google');
    }
};

export const saveGoogleSessionToDatabase = async (accessToken: string, refreshToken: string) => {
    try {
        console.log('Tentando salvar sessão no banco de dados com accessToken:', accessToken, 'e refreshToken:', refreshToken);
        const response = await axios.post(`${API_URL}/auth/save-session`, { accessToken, refreshToken });

        setSession(accessToken, refreshToken);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Erro ao salvar sessão no banco de dados:', error.response.data);
        } else if (axios.isAxiosError(error) && error.request) {
            console.error('Erro ao salvar sessão no banco de dados: Nenhuma resposta recebida', error.request);
        } else if (error instanceof Error) {
            console.error('Erro ao salvar sessão no banco de dados:', error.message);
        } else {
            console.error('Erro ao salvar sessão no banco de dados:', error);
        }
        throw new Error('Erro ao salvar sessão no banco de dados');
    }
};

export const saveMetaSessionToDatabase = async (accessToken: string) => {
    try {
        console.log('Tentando salvar sessão no banco de dados com accessToken:', accessToken);
        const response = await axios.post(`${API_URL}/auth/save-session`, { accessToken });

        setSession(accessToken, '');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ access_token: accessToken, refresh_token: '' }));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Erro ao salvar sessão no banco de dados:', error.response.data);
        } else if (axios.isAxiosError(error) && error.request) {
            console.error('Erro ao salvar sessão no banco de dados: Nenhuma resposta recebida', error.request);
        } else if (error instanceof Error) {
            console.error('Erro ao salvar sessão no banco de dados:', error.message);
        } else {
            console.error('Erro ao salvar sessão no banco de dados:', error);
        }
        throw new Error('Erro ao salvar sessão no banco de dados');
    }
};

export const saveFacebookSessionToDatabase = async (accessToken: string) => {
    try {
        console.log('Tentando salvar sessão no banco de dados com accessToken:', accessToken);
        const response = await axios.post(`${API_URL}/auth/save-session`, { accessToken });

        setSession(accessToken, '');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ access_token: accessToken, refresh_token: '' }));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Erro ao salvar sessão no banco de dados:', error.response.data);
        } else if (axios.isAxiosError(error) && error.request) {
            console.error('Erro ao salvar sessão no banco de dados: Nenhuma resposta recebida', error.request);
        } else if (error instanceof Error) {
            console.error('Erro ao salvar sessão no banco de dados:', error.message);
        } else {
            console.error('Erro ao salvar sessão no banco de dados:', error);
        }
        throw new Error('Erro ao salvar sessão no banco de dados');
    }
};

export const validateToken = async (token: string) => {
    console.log('authService: Validating token:', token);
    const response = await axios.post(`${API_URL}/auth/validate-token`, { token });
    console.log('authService: validateToken response:', response.data);
    return response.data;
};

export const linkMetaAds = (isLoggedIn: boolean) => {
    const clientId = import.meta.env.VITE_FACEBOOK_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_FACEBOOK_REDIRECT_URI;
    let metaOAuthURL = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=ads_management`;

    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const id = user.id;

        if (!clientId || !redirectUri || !id) {
            console.error('Facebook OAuth environment variables are not set: ', clientId, redirectUri, id);
            return;
        }

        metaOAuthURL = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}?id=${id}&response_type=code&scope=ads_management`;
    }

    const newWindow = window.open(metaOAuthURL, 'metaOAuth', 'width=600,height=400');

    window.addEventListener('message', (event) => {
        console.log('Mensagem recebida na janela:', event);
        if (event.origin !== window.location.origin) return;

        const { accessToken, user, type } = event.data;
        if (type === 'facebook-login') {
            if (accessToken && user) {
                console.log('Facebook OAuth successful:', event.data);
                setSession(accessToken, '');
                localStorage.setItem('user', JSON.stringify(user));
                if (newWindow) {
                    newWindow.close();
                }
            } else {
                console.error('Facebook OAuth failed:', event.data);
            }
        }
    });
};

export const fetchGoogleAdsAccounts = async (accessToken: string, userId: string) => {
    const response = await api.get(`/accounts/google-ads/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const fetchFacebookAdAccounts = async (accessToken: string, userId: string) => {
    const response = await api.get(`/accounts/facebook-ads/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const checkAdsAccounts = async (accessToken: string, userId: string) => {
    const response = await api.get(`/accounts/customers/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const checkFacebookAdAccounts = async (accessToken: string, userId: string) => {
    const response = await api.get(`/accounts/facebook-ads/check/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const activateAccount = async (accessToken: string, accountId: string, platform: string) => {
    try {
        const response = await axios.put(`${API_URL}/accounts/activate`, {
            accountId,
            platform,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error activating account:', error);
        throw error;
    }
};

export const fetchMetaAdsCampaigns = async (accessToken: string, accountId: string) => {
    try {
        const response = await api.get(`/meta-ads/${accountId}/campaigns`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching Meta Ads campaigns:', error.response ? error.response.data : error.message);
        } else {
            console.error('Error fetching Meta Ads campaigns:', error);
        }
        throw error;
    }
};

export const fetchMetaAdsAdsets = async (accessToken: string, campaignId: string) => {
    const response = await api.get(`/meta-ads/campaigns/${campaignId}/adsets`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const fetchMetaAdsAds = async (accessToken: string, campaignId: string) => {
    const response = await api.get(`/meta-ads/adsets/${campaignId}/ads`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const fetchMetaAdsCampaignDetails = async (accessToken: string, campaignId: string) => {
    try {
        const response = await api.get(`/meta-ads/campaigns/${campaignId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Meta Ads campaign details:', error);
        throw error;
    }
};

export const fetchMetaAdsAdsetDetails = async (accessToken: string, adsetId: string) => {
    try {
        const response = await api.get(`/meta-ads/adsets/${adsetId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Meta Ads adset details:', error);
        throw error;
    }
};

export const fetchMetaAdsAdDetails = async (accessToken: string, adId: string) => {
    try {
        const response = await api.get(`/meta-ads/ads/${adId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Meta Ads ad details:', error);
        throw error;
    }
};

export const fetchMetaAdsFullAdDetails = async (accessToken: string, adId: string) => {
    try {
        const response = await api.get(`/meta-ads/ads/full/${adId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Meta Ads full ad details:', error);
        throw error;
    }
};

export const createMetaAdsCampaign = async (accessToken: string, campaignData: any) => {
    try {
        const response = await axios.post(`${API_URL}/meta-ads/create-campaign`, campaignData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar campanha do Meta Ads:', error);
        throw new Error('Erro ao criar campanha do Meta Ads');
    }
};

export const createMetaAdsAd = async (accessToken: string, adData: any) => {
    try {
        const response = await axios.post(`${API_URL}/meta-ads/create-ad`, adData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar anúncio no Meta Ads:', error);
        throw new Error('Erro ao criar anúncio no Meta Ads');
    }
};

export const createFacebookBusinessManager = async (accessToken: string, userId: string, businessData: any) => {
    try {
        const response = await axios.post(`https://graph.facebook.com/v14.0/${userId}/businesses`, businessData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Business Manager do Facebook:', error);
        throw new Error('Erro ao criar Business Manager do Facebook');
    }
};

export const createFacebookAdAccount = async (accessToken: string, businessId: string, adAccountData: any) => {
    try {
        const response = await axios.post(`https://graph.facebook.com/v10.0/${businessId}/adaccounts`, adAccountData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Ad Account do Facebook:', error);
        throw new Error('Erro ao criar Ad Account do Facebook');
    }
};

export const createCampaign = async (accessToken: string, campaignData: any) => {
    try {
        const response = await api.post('/meta-ads/create-campaign', {
            ...campaignData,
            startDate: new Date(campaignData.startDate).toISOString(),
            endDate: new Date(campaignData.endDate).toISOString()
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar campanha:', error);
        throw new Error('Erro ao criar campanha');
    }
};

export const updateMetaAdsCampaign = async (campaignId: string, campaignData: any) => {
    try {
        const response = await api.put(`/meta-ads/campaigns/${campaignId}`, campaignData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar campanha:', error);
        throw new Error('Erro ao atualizar campanha');
    }
};

export const createGuidedCampaign = async (accessToken: string, campaignData: any) => {
    try {
        const response = await axios.post(`${API_URL}/meta-ads/campaigns/create-guided`, campaignData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar campanha guiada:', error);
        throw new Error('Erro ao criar campanha guiada');
    }
};

export const createAutomaticCampaign = async (accessToken: string, campaignData: any) => {
    try {
        const response = await axios.post(`${API_URL}/meta-ads/campaigns/create-automatic`, campaignData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar campanha automática:', error);
        throw new Error('Erro ao criar campanha automática');
    }
};


export const uploadCreativeFiles = async (accessToken: string, customerId: string, files: File[], pageId: string, link: string, message: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('page_id', pageId);
    formData.append('link', link);
    formData.append('message', message);

    try {
        console.info(`Enviando ${files.length} arquivos para ${API_URL}/meta-ads/creatives/upload...`);

        const response = await axios.post(`${API_URL}/meta-ads/${customerId}/creatives/upload`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        console.info('Resposta da API:', response.data);
        return response.data; // Retorna a resposta da API
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro durante o upload para a API do Meta Ads:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || 'Erro ao fazer upload dos arquivos.');
        }
        console.error('Erro inesperado durante o upload:', error);
        throw new Error('Erro inesperado durante o upload dos arquivos.');
    }
};


export const requestCreativeBasedOnCompetitor = async (accessToken: string, competitorAdId: string) => {
    try {
        const response = await axios.post(`${API_URL}/meta-ads/creatives/request`, { competitorAdId }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao solicitar criativo baseado em concorrente:', error);
        throw new Error('Erro ao solicitar criativo baseado em concorrente');
    }
};

export const createAdSet = async (accessToken: string, adSetData: any) => {
    try {
        const response = await axios.post(`${API_URL}/meta-ads/create-adset`, adSetData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar conjunto de anúncios no Meta Ads:', error);
        throw new Error('Erro ao criar conjunto de anúncios no Meta Ads');
    }
};

export const createAd = async (accessToken: string, adData: any) => {
    try {
        const response = await axios.post(`${API_URL}/meta-ads/create-ad`, adData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar anúncio no Meta Ads:', error);
        throw new Error('Erro ao criar anúncio no Meta Ads');
    }
};

export default api;
