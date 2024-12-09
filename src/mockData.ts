import { Campaign } from './types';

export const predefinedCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campanha 1',
    objective: 'Conversões',
    budget: '1000',
    status: 'active',
    startDate: '01/01/2023',
    endDate: '31/12/2023',
    impressions: 10000,
    clicks: 500,
    spend: '800',
    specialAdCategories: ['category1', 'category2'], // Example categories
    ads: [],
    userId: '',
    mode: 'automatic',
    platform: 'Facebook',
    ctr: '5',
    cpc: 1.6,
    cpm: 80,
    reach: 8000,
    frequency: 1.25,
    adsets: []
  },
  {
    id: '2',
    name: 'Campanha 2',
    objective: 'Tráfego',
    budget: '500',
    status: 'paused',
    startDate: '01/02/2023',
    endDate: '30/11/2023',
    impressions: 5000,
    clicks: 200,
    spend: '300',
    specialAdCategories: ['category3'], // Example category
    ads: [],
    userId: '',
    mode: 'automatic',
    platform: 'Google',
    ctr: '4',
    cpc: 1.5,
    cpm: 60,
    reach: 4000,
    frequency: 1.25,
    adsets: []
  },
];

export const mockChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 700 },
  { name: 'May', value: 600 },
  { name: 'Jun', value: 650 },
  { name: 'Jul', value: 700 },
  { name: 'Aug', value: 750 },
  { name: 'Sep', value: 800 },
  { name: 'Oct', value: 850 },
  { name: 'Nov', value: 900 },
  { name: 'Dec', value: 950 },
];

export const mockCampaignPerformance = [
  { name: 'Campaign 1', clicks: 100, impressions: 1000, ctr: 10 },
  { name: 'Campaign 2', clicks: 150, impressions: 1200, ctr: 12.5 },
  { name: 'Campaign 3', clicks: 200, impressions: 1500, ctr: 13.3 },
  { name: 'Campaign 4', clicks: 250, impressions: 1800, ctr: 13.9 },
  { name: 'Campaign 5', clicks: 300, impressions: 2000, ctr: 15 },
];

export const mockCreateCampaign = async (data: any): Promise<Campaign> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'mockCampaignId',
        userId: '',
        mode: data.mode,
        name: data.name,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        objective: data.objective,
        specialAdCategories: data.specialAdCategories || [],
        clicks: 0,
        impressions: 0,
        ads: [],
        spend: '0',
        platform: data.platform,
        ctr: '0',
        cpc: 0,
        cpm: 0,
        reach: 0,
        frequency: 0,
        adsets: []
      });
    }, 1000);
  });
};

export const mockCreateAdSet = async (_data: any): Promise<{ id: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 'mockAdSetId' });
    }, 1000);
  });
};

export const mockCreateAd = async (_data: any): Promise<{ id: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 'mockAdId' });
    }, 1000);
  });
};
