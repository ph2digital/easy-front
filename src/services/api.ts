// src/services/api.ts
import axios from 'axios';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store/index';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});
const API_URL = 'http://localhost:8080/api';
const META_KEY = import.meta.env.VITE_META_KEY || 'default-META-token';
const USER_KEY = 'user';
const APP_STATE_KEY = 'app-state';
const STORAGE_KEY_GOOGLE = import.meta.env.VITE_STORAGE_KEY_GOOGLE || 'default-google-auth-token';
const STORAGE_KEY_META = import.meta.env.VITE_STORAGE_KEY_META || 'default-meta-auth-token';

const isValidJSON = (str: string | null) => {
    if (!str) return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

export const getSessionFromLocalStorage = () => {
    const storedGoogleToken = localStorage.getItem(STORAGE_KEY_GOOGLE);
    const storedMetaToken = localStorage.getItem(STORAGE_KEY_META);
    const storedUser = localStorage.getItem(USER_KEY);

    if (isValidJSON(storedGoogleToken) && isValidJSON(storedMetaToken) && isValidJSON(storedUser)) {
        return {
            google: JSON.parse(storedGoogleToken!),
            meta: JSON.parse(storedMetaToken!),
            user: JSON.parse(storedUser!),
        };
    }
    return null;
};

export const setSession = (googleAccessToken: string, googleRefreshToken: string, metaAccessToken: string, metaRefreshToken: string, user: any, appState: any) => {
    localStorage.setItem(STORAGE_KEY_GOOGLE, JSON.stringify({ access_token: googleAccessToken, refresh_token: googleRefreshToken }));
    localStorage.setItem(STORAGE_KEY_META, JSON.stringify({ access_token: metaAccessToken, refresh_token: metaRefreshToken }));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(appState));
};

export const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY_GOOGLE);
    localStorage.removeItem(STORAGE_KEY_META);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(APP_STATE_KEY);
};

export const getUserEmailFromSession = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).email : null;
};

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

export const saveGoogleSessionToDatabase = async (accessToken: string, refreshToken: string, email: string, name: string, picture: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/save-session`, { accessToken, refreshToken, email, name, picture });

        if (!response.data.user) {
            throw new Error('User data is undefined in the response');
        }

        setSession(accessToken, refreshToken, '', '', response.data.user, response.data.appState);
        localStorage.setItem(STORAGE_KEY_GOOGLE, JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
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

export const saveMetaSessionToDatabase = async (accessToken: string, refreshToken: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/save-session`, { accessToken, refreshToken });

        if (!response.data.user) {
            throw new Error('User data is undefined in the response');
        }

        setSession('', '', accessToken, refreshToken, response.data.user, response.data.appState);
        localStorage.setItem(STORAGE_KEY_META, JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
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
        const response = await axios.post(`${API_URL}/auth/save-session`, { accessToken });

        setSession('', '', accessToken, '', response.data.user, response.data.appState);
        localStorage.setItem(META_KEY, JSON.stringify({ access_token: accessToken, refresh_token: '' }));
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

export const linkMetaAds = (id?: string) => {
  const clientId = import.meta.env.VITE_FACEBOOK_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_FACEBOOK_REDIRECT_URI;
  let metaOAuthURL = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=ads_management`;

  if (id) {
    metaOAuthURL = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}?id=${id}&response_type=code&scope=ads_management`;
  }
  console.log('metaOAuthURL:', JSON.stringify(metaOAuthURL));

  const newWindow = window.open(metaOAuthURL, 'metaOAuth', 'width=600,height=800');

  window.addEventListener('message', (event) => {
    console.log('Mensagem recebida na janela:', event);
    if (event.origin === window.location.origin) {
      const { accessToken, user, type } = event.data;
      if (type === 'facebook-login') {
        if (accessToken && user) {
          console.log('Facebook OAuth successful:', event.data);
          setSession(accessToken, '', '', '', user, event.data.appState);
          localStorage.setItem('user', JSON.stringify(user));
          if (newWindow) {
            newWindow.close();
          }
        } else {
          console.error('Facebook OAuth failed:', event.data);
        }
      }
    }
  });

  return newWindow;
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

export const updateMetaAdsCampaign = async (campaignId: string, campaignData: any, accessToken: string) => {
  try {
    const response = await api.put(`/meta-ads/campaigns/${campaignId}`, campaignData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

export const updateMetaAdsAdset = async (adsetId: string, adsetData: any, accessToken: string) => {
  try {
    const response = await api.put(`/meta-ads/adsets/${adsetId}`, adsetData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar conjunto de anúncios:', error);
    throw new Error('Erro ao atualizar conjunto de anúncios');
  }
};

export const linkAccountFromHome = async (platform: string, userId: string) => {
  try {
    const session = getSessionFromLocalStorage();
    const accessToken = platform === 'google_ads' ? session?.google.access_token : session?.meta.access_token;

    if (!accessToken) {
      throw new Error('Token de acesso não encontrado');
    }

    const response = await api.post('/auth/link-account-from-home', { platform, userId }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true, // Certifique-se de que os cookies de sessão estão sendo enviados
    });
    return response.data.authUrl;
  } catch (error) {
    console.error('Erro ao vincular conta a partir da tela de home:', error);
    throw error;
  }
};

export const fetchMetaAdsCampaignInsights = async (accessToken: string, campaignId: string) => {
  const response = await api.get(`/meta-ads/campaigns/${campaignId}/insights`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const fetchMetaAdsAdsetInsights = async (accessToken: string, adsetId: string) => {
  const response = await api.get(`/meta-ads/adsets/${adsetId}/insights`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const fetchMetaAdsAdInsights = async (accessToken: string, adId: string) => {
  const response = await api.get(`/meta-ads/ads/${adId}/insights`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const fetchCustomAudiences = async (accessToken: string, adAccountId: string) => {
    try {
        const response = await api.get(`/meta-ads/${adAccountId}/custom-audiences`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching custom audiences:', error);
        throw error;
    }
};

export const createCustomAudience = async (accessToken: string, adAccountId: string, audienceData: any) => {
    try {
        const response = await api.post(`/meta-ads/${adAccountId}/create-custom-audience`, audienceData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating custom audience:', error);
        throw error;
    }
};

export const getGPTResponse = async (
  prompt: string, 
  userId: string, 
  activeThread: string | null, 
  selectedCustomer?: string, 
  accessToken?: string, 
  customerGestor?: string
) => {
  console.log('[getGPTResponse] Starting GPT response', { 
    prompt, 
    userId, 
    activeThread, 
    selectedCustomer, 
    accessToken, 
    customerGestor 
  });

  try {
    const response = await axios.post(`${API_URL}/gpt`, { 
      prompt, 
      userId, 
      activeThread, 
      selectedCustomer, 
      accessToken, 
      customerGestor 
    });

    // Extrai a resposta do assistente
    const assistantResponse = response.data?.result?.data?.content || '';

    // Gera título para a thread (primeiros 50 caracteres)
    const threadTitle = assistantResponse.length > 0
      ? assistantResponse.substring(0, 50).trim() + (assistantResponse.length > 50 ? '...' : '')
      : 'Nova Conversa';

    // Se for uma thread existente, atualiza o título
    if (activeThread) {
      try {
        await axios.patch(`${API_URL}/gpt/threads/${activeThread}`, { 
          metadata: { 
            title: threadTitle 
          } 
        });
      } catch (updateError) {
        console.warn('[getGPTResponse] Erro ao atualizar título da thread', updateError);
      }
    }

    return response.data;
  } catch (error) {
    console.error('[getGPTResponse] Error getting GPT response', error);
    throw error;
  }
};

export const getGPTResponseStream = async (
  prompt: string, 
  userId: string, 
  activeThread: string | null, 
  selectedCustomer: string | null, 
  accessToken: string | null, 
  customerGestor: string | null,
  onChunk?: (chunk: string) => void
) => {
  try {
    const response = await fetch(`${API_URL}/gpt/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        userId,
        thread: activeThread,
        selectedCustomer,
        accessToken,
        customerGestor
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is null');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          onChunk?.(data);
        }
      }
    }

    if (buffer) {
      const data = buffer.replace('data: ', '');
      if (data.trim()) {
        onChunk?.(data);
      }
    }

  } catch (error) {
    console.error('Error in GPT stream:', error);
    throw error;
  }
};

export const listLinkedAccounts = async (accessToken: string, userId: string) => {
    const response = await api.get(`/accounts/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const createGoogleAdsCampaign = async (accessToken: string, accountId: string, campaignData: any) => {
    const response = await api.post(`/accounts/${accountId}/campaigns`, campaignData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const updateGoogleAdsCampaign = async (accessToken: string, accountId: string, campaignId: string, campaignData: any) => {
    const response = await api.put(`/accounts/${accountId}/campaigns/${campaignId}`, campaignData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const deleteGoogleAdsCampaign = async (accessToken: string, accountId: string, campaignId: string) => {
    const response = await api.delete(`/accounts/${accountId}/campaigns/${campaignId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const createGoogleAdsAdGroup = async (accessToken: string, accountId: string, adGroupData: any) => {
    const response = await api.post(`/accounts/${accountId}/ad-groups`, adGroupData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const deleteGoogleAdsAdGroup = async (accessToken: string, accountId: string, adGroupId: string) => {
    const response = await api.delete(`/accounts/${accountId}/ad-groups/${adGroupId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const fetchGoogleAdsCampaigns = async (accessToken: string) => {
  const selectedCustomer = localStorage.getItem('selectedCustomer');
  const selectedCustomerDetailsStr = localStorage.getItem('selectedCustomerDetails');

  if (!selectedCustomer || !selectedCustomerDetailsStr) {
    throw new Error('No customer selected or missing customer details');
  }

  try {
    const customerDetails = JSON.parse(selectedCustomerDetailsStr);
    const { customer_id, gestor_id } = customerDetails;

    if (!customer_id) {
      throw new Error('Selected customer is missing customer_id');
    }

    // Format IDs to XXX-XXX-XXXX format
    const formattedCustomerId = customer_id.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    const formattedGestorId = gestor_id?.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') || formattedCustomerId;

    const response = await api.get('/google-ads/campaigns/list', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        customerid: formattedCustomerId,
        customergestor: formattedGestorId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in fetchGoogleAdsCampaigns:', error);
    throw error;
  }
};

export const setSelectedCustomer = (customer: any) => {
  if (!customer) {
    localStorage.removeItem('selectedCustomer');
    localStorage.removeItem('selectedCustomerDetails');
    localStorage.removeItem('selectedCustomerType');
    return;
  }

  // Store all customer information
  localStorage.setItem('selectedCustomer', customer.id);
  localStorage.setItem('selectedCustomerType', customer.type);
  localStorage.setItem('selectedCustomerDetails', JSON.stringify({
    id: customer.id,
    name: customer.name,
    type: customer.type,
    customer_id: customer.customer_id,
    gestor_id: customer.gestor_id,
    status: customer.status,
    created_at: customer.created_at,
    updated_at: customer.updated_at,
    // Include any other relevant fields from the customer object
  }));
};

export const fetchCampaigns = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const selectedCustomer = localStorage.getItem('selectedCustomer');
  const selectedCustomerType = localStorage.getItem('selectedCustomerType');

  if (!accessToken || !selectedCustomer) {
    throw new Error('Missing required authentication or customer information');
  }

  try {
    if (selectedCustomerType === 'google_ads') {
      return await fetchGoogleAdsCampaigns(accessToken);
    } else if (selectedCustomerType === 'meta_ads') {
      return await fetchMetaAdsCampaigns(accessToken, selectedCustomer);
    } else {
      throw new Error('Unsupported customer type');
    }
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const submitComment = async (userId: string, messageId: string, comment: string) => {
    try {
        const response = await api.post('/comments', { userId, messageId, comment });
        return response.data;
    } catch (error) {
        console.error('Error submitting comment:', error);
        throw error;
    }
};

export const sendChatMessage = async (content: string, threadId?: string, metadata?: any) => {
  try {
    if (!threadId) {
      throw new Error('Thread ID is required to send a message');
    }
    const response = await api.post(`/gpt/threads/${threadId}/messages`, { 
      content,
      metadata,
      role: 'user'  // Required by OpenAI API
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export const createThread = async (
  prompt: string, 
  userId: string, 
  selectedCustomer?: string, 
  customerGestor?: string, 
  metadata?: any
) => {
  try {
    const response = await api.post('/gpt/threads', {
      prompt,
      user_id: userId,
      customer_id: selectedCustomer,
      customer_gestor: customerGestor,
      metadata: metadata || {
        title: prompt,
        user_id: userId,
        customer_id: selectedCustomer,
        gestor_id: customerGestor
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

export const fetchThreads = async (userId: string) => {
  try {
    const response = await api.get(`/gpt/threads/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw error;
  }
};

export const fetchMessages = async (threadId: string) => {
  try {
    const response = await api.get(`/gpt/threads/${threadId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const fetchRuns = async (threadId: string) => {
  try {
    const response = await api.get(`/gpt/threads/${threadId}/runs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching runs:', error);
    throw error;
  }
};

export const fetchCustomersByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/accounts/customers/${userId}`);
    return response.data.linked_customers || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const validateGoogleToken = async (accessToken: string) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    return response.data;
  } catch (error) {
    console.error('Error validating Google token:', error);
    throw new Error('Error validating Google token');
  }
};

export const validateAndRefreshGoogleToken = async (accessToken: string, refreshToken: string) => {
  try {
    // Validate the token
    await validateGoogleToken(accessToken);
  } catch (error) {
    console.log('Google token expired, refreshing token...');
    try {
      // Refresh the token
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });

      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token || refreshToken;

      // Update the session with the new tokens
      const session = getSessionFromLocalStorage();
      if (session) {
        setSession(newAccessToken, newRefreshToken, session.meta.access_token, session.meta.refresh_token, session.user, {}); // Remove appState
      }

      return newAccessToken;
    } catch (refreshError) {
      console.error('Error refreshing Google token:', refreshError);
      throw new Error('Error refreshing Google token');
    }
  }
  return accessToken;
};

export const listAccessibleCustomers = async (accessToken: string) => {
  try {
    const response = await api.get('/google-ads/customers', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.accessibleCustomers;
  } catch (error) {
    console.error('Erro ao listar clientes acessíveis:', error);
    throw new Error('Erro ao listar clientes acessíveis');
  }
};

export const identifyManagerAccount = async (accessToken: string, userId: string) => {
  try {
    const response = await api.get('/google-ads/manager-account', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        userId,
      },
    });
    return response.data.customerGestor;
  } catch (error) {
    console.error('Erro ao identificar conta gestora:', error);
    throw new Error('Erro ao identificar conta gestora');
  }
};

export const listCustomers = async (userId: string) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    console.log('Fetching customers with:', { userId, hasAccessToken: !!accessToken });
    
    const response = await api.get(`/accounts/customers/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'userid': userId
      }
    });
    
    console.log('Customers API response:', response.data);
    return response.data.linked_customers;
  } catch (error) {
    console.error('Error listing customers:', error);
    if (axios.isAxiosError(error)) {
      console.error('Request details:', {
        config: error.config,
        response: error.response
      });
    }
    throw error;
  }
};

export default api;
