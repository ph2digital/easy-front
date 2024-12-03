// Mock Campaigns
export const getMockCampaigns = (accountId: string) => {
  console.log('getMockCampaigns - Generating mock campaigns for accountId:', accountId);
  const campaigns = [
    {
      id: '1',
      name: 'Mock Campaign 1',
      platform: 'Meta Ads',
      objective: 'Mock Objective',
      budget: '1000',
      status: 'active',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      insights: {
        data: [
          {
            impressions: '1000',
            clicks: '100',
            spend: '500',
            ctr: '10%',
            cpc: '5',
            cpm: '50',
            reach: '800',
            frequency: '1.25',
          },
        ],
      },
    },
    {
      id: '2',
      name: 'Mock Campaign 2',
      platform: 'Meta Ads',
      objective: 'Conversions',
      budget: '2000',
      status: 'paused',
      startDate: '2023-06-01',
      endDate: '2023-12-01',
      insights: {
        data: [
          {
            impressions: '1500',
            clicks: '200',
            spend: '800',
            ctr: '13%',
            cpc: '4',
            cpm: '40',
            reach: '1200',
            frequency: '1.8',
          },
        ],
      },
    },
    {
      id: '3',
      name: 'Mock Campaign 3',
      platform: 'Meta Ads',
      objective: 'Brand Awareness',
      budget: '500',
      status: 'inactive',
      startDate: '2023-03-15',
      endDate: '2023-08-15',
      insights: {
        data: [
          {
            impressions: '2500',
            clicks: '50',
            spend: '300',
            ctr: '2%',
            cpc: '6',
            cpm: '120',
            reach: '2300',
            frequency: '2.1',
          },
        ],
      },
    },
    // Add more mock campaigns as needed
  ];

  // Associate campaigns with the given accountId
  return campaigns.map(campaign => ({ ...campaign, accountId }));
};

// Mock Adsets
export const getMockAdsetDetails = () => {
  console.log('getMockAdsetDetails - Generating mock adsets');
  return [
    {
      id: 'adset1',
      name: 'Adset 1',
      status: 'active',
      budget_remaining: '200',
      created_time: '2023-01-01T00:00:00Z',
      updated_time: '2023-06-01T00:00:00Z',
      start_time: '2023-01-01T00:00:00Z',
      end_time: '2023-12-31T00:00:00Z',
      optimization_goal: 'Conversions',
      insights: {
        data: [
          {
            impressions: '1000',
            clicks: '50',
            spend: '200',
            ctr: '5%',
            cpc: '4',
            cpm: '20',
          },
        ],
      },
    },
    {
      id: 'adset2',
      name: 'Adset 2',
      status: 'paused',
      budget_remaining: '100',
      created_time: '2023-02-01T00:00:00Z',
      updated_time: '2023-07-01T00:00:00Z',
      start_time: '2023-02-01T00:00:00Z',
      end_time: '2023-09-30T00:00:00Z',
      optimization_goal: 'Clicks',
      insights: {
        data: [
          {
            impressions: '800',
            clicks: '30',
            spend: '150',
            ctr: '3.75%',
            cpc: '5',
            cpm: '18.75',
          },
        ],
      },
    },
    // Add more mock adsets as needed
  ];
};

// Mock Ads
export const getMockAdDetails = () => {
  console.log('getMockAdDetails - Generating mock ads');
  return [
    {
      id: 'ad1',
      name: 'Ad 1',
      status: 'active',
      createdTime: '2023-01-01T00:00:00Z',
      updatedTime: '2023-06-01T00:00:00Z',
      insights: {
        data: [
          {
            impressions: '500',
            clicks: '20',
            spend: '100',
            ctr: '4%',
            cpc: '5',
            cpm: '10',
          },
        ],
      },
      creative: {
        title: 'Creative Title 1',
        description: 'Creative Description 1',
        image_url: 'https://via.placeholder.com/150',
      },
    },
    {
      id: 'ad2',
      name: 'Ad 2',
      status: 'inactive',
      createdTime: '2023-02-01T00:00:00Z',
      updatedTime: '2023-08-01T00:00:00Z',
      insights: {
        data: [
          {
            impressions: '300',
            clicks: '10',
            spend: '50',
            ctr: '3.33%',
            cpc: '5',
            cpm: '16.67',
          },
        ],
      },
      creative: {
        title: 'Creative Title 2',
        description: 'Creative Description 2',
        image_url: 'https://via.placeholder.com/150',
      },
    },
    // Add more mock ads as needed
  ];
};

// Mock Custom Audiences
export const getMockCustomAudiences = () => {
  console.log('getMockCustomAudiences - Generating mock custom audiences');
  return [
    {
      id: 'audience1',
      name: 'Audience 1',
      size: 5000,
      type: 'Custom Audience',
    },
    {
      id: 'audience2',
      name: 'Audience 2',
      size: 10000,
      type: 'Lookalike Audience',
    },
    // Add more mock audiences as needed
  ];
};

// Mock Campaign Insights
export const getMockCampaignInsights = () => {
  console.log('getMockCampaignInsights - Generating mock campaign insights');
  return [
    {
      campaign_id: '1',
      impressions: '5000',
      clicks: '500',
      spend: '1000',
      ctr: '10%',
      cpc: '2',
      cpm: '20',
    },
    {
      campaign_id: '2',
      impressions: '3000',
      clicks: '300',
      spend: '600',
      ctr: '10%',
      cpc: '2',
      cpm: '20',
    },
    // Add more mock campaign insights as needed
  ];
};

// Mock Adset Insights
export const getMockAdsetInsights = () => {
  console.log('getMockAdsetInsights - Generating mock adset insights');
  return [
    {
      adset_id: 'adset1',
      impressions: '2000',
      clicks: '200',
      spend: '400',
      ctr: '10%',
      cpc: '2',
      cpm: '20',
    },
    // Add more mock adset insights as needed
  ];
};

// Mock Ad Insights
export const getMockAdInsights = () => {
  console.log('getMockAdInsights - Generating mock ad insights');
  return [
    {
      ad_id: 'ad1',
      impressions: '1000',
      clicks: '50',
      spend: '200',
      ctr: '5%',
      cpc: '4',
      cpm: '20',
    },
    // Add more mock ad insights as needed
  ];
};

// Mock Ad Accounts
export const getMockAdAccounts = () => {
  console.log('getMockAdAccounts - Generating mock ad accounts');
  return [
    {
      account_id: 'mockbarbeariaId',
      accountDetails: {
        name: 'Mock barbearia',
        business_name: 'Mock Business1',
        amount_spent: 1000,
        currency: 'USD',
      },
    },
    {
      account_id: 'mockpizzariaId',
      accountDetails: {
        name: 'Mock pizzaria',
        business_name: 'Mock Business2',
        amount_spent: 2000,
        currency: 'USD',
      },
    },
    {
      account_id: 'mockLinkedInAccountId',
      accountDetails: {
        name: 'Mock fabrica',
        business_name: 'Mock Business3',
        amount_spent: 1500,
        currency: 'USD',
      },
    }
  ];
};

// Mock Google Ads Accounts
export const getMockGoogleAdsAccounts = () => {
  console.log('getMockGoogleAdsAccounts - Generating mock Google Ads accounts');
  return { customerIds: ['mockGoogleAccountId'] };
};

// Mock Facebook Ad Accounts
export const getMockFacebookAdAccounts = () => {
  console.log('getMockFacebookAdAccounts - Generating mock Facebook Ad accounts');
  return { adAccounts: getMockAdAccounts() };
};

// Mock Campaign Details
export const getMockCampaignDetails = (campaignId: string) => {
  console.log('getMockCampaignDetails - Fetching mock campaign details for campaignId:', campaignId);
  return getMockCampaigns('').find((campaign) => campaign.id === campaignId);
};

// Mock Full Ad Details
export const getMockFullAdDetails = () => {
  console.log('getMockFullAdDetails - Generating mock full ad details');
  return {};
};

// Mock Audience
export const getMockAudience = (audienceData: any) => {
  console.log('getMockAudience - Generating mock audience for audienceData:', audienceData);
  return { ...audienceData, id: 'mockAudienceId' };
};

// Mock Creative Files
export const getMockCreativeFiles = () => {
  console.log('getMockCreativeFiles - Generating mock creative files');
  return { success: true };
};

// Mock Creative Based on Competitor
export const getMockCreativeBasedOnCompetitor = () => {
  console.log('getMockCreativeBasedOnCompetitor - Generating mock creative based on competitor');
  return { success: true };
};