import axios from 'axios';

const META_API_VERSION = 'v18.0';
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

interface MetaAdsResponse<T> {
  data: T;
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface Page {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: {
    id: string;
  };
}

export interface AdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_name: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget: number;
  lifetime_budget: number;
  start_time: string;
  end_time?: string;
}

export interface AdInsight {
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  frequency: string;
  date_start: string;
  date_stop: string;
}

export const metaAdsService = {
  async getPages(accessToken: string): Promise<Page[]> {
    try {
      const response = await axios.get<MetaAdsResponse<Page[]>>(
        `${BASE_URL}/me/accounts`,
        {
          params: {
            access_token: accessToken,
            fields: 'id,name,access_token,instagram_business_account',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  },

  async getAdAccounts(accessToken: string): Promise<AdAccount[]> {
    try {
      const response = await axios.get<MetaAdsResponse<AdAccount[]>>(
        `${BASE_URL}/me/adaccounts`,
        {
          params: {
            access_token: accessToken,
            fields: 'id,name,account_status,currency,timezone_name',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      throw error;
    }
  },

  async createCampaign(
    accessToken: string,
    adAccountId: string,
    campaignData: Partial<AdCampaign>
  ): Promise<AdCampaign> {
    try {
      const response = await axios.post<AdCampaign>(
        `${BASE_URL}/${adAccountId}/campaigns`,
        null,
        {
          params: {
            access_token: accessToken,
            ...campaignData,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  async getAdInsights(
    accessToken: string,
    adAccountId: string,
    datePreset: string = 'last_30d'
  ): Promise<AdInsight[]> {
    try {
      const response = await axios.get<MetaAdsResponse<AdInsight[]>>(
        `${BASE_URL}/${adAccountId}/insights`,
        {
          params: {
            access_token: accessToken,
            fields: 'impressions,clicks,spend,reach,frequency',
            date_preset: datePreset,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching ad insights:', error);
      throw error;
    }
  },

  async schedulePost(
    accessToken: string,
    pageId: string,
    message: string,
    scheduledTime: string
  ): Promise<{ id: string }> {
    try {
      const response = await axios.post<{ id: string }>(
        `${BASE_URL}/${pageId}/feed`,
        null,
        {
          params: {
            access_token: accessToken,
            message,
            scheduled_publish_time: new Date(scheduledTime).getTime() / 1000,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error scheduling post:', error);
      throw error;
    }
  },

  async getInstagramComments(
    accessToken: string,
    instagramAccountId: string
  ): Promise<any[]> {
    try {
      const response = await axios.get(
        `${BASE_URL}/${instagramAccountId}/media`,
        {
          params: {
            access_token: accessToken,
            fields: 'comments{text,timestamp,username,replies}',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Instagram comments:', error);
      throw error;
    }
  },

  async replyToComment(
    accessToken: string,
    commentId: string,
    message: string
  ): Promise<{ success: boolean }> {
    try {
      await axios.post(
        `${BASE_URL}/${commentId}/replies`,
        null,
        {
          params: {
            access_token: accessToken,
            message,
          },
        }
      );
      return { success: true };
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  },
};