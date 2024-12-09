import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CampaignEditPopup from '../components/Campaign/CampaignEditPopup';
import AdsetEditPopup from '../components/ads/AdsetEditPopup';
import AdEditPopup from '../components/ads/AdEditPopup';
import CampaignOverview from '../components/Campaign/CampaignOverview';
import AnalyticsPanel from '../components/Dashboard/AnalyticsPanel';
import ActionButtons from '../components/ui/Button/ActionButtons';
import './styles/CampaignDetails.css';
import LoadingSpinner from '../components/LoadingSpinner';

interface Campaign {
  id: string;
  name: string;
  account_id: string;
  status: string;
  effective_status: string;
  objective: string;
  created_time: string;
  updated_time: string;
  start_time: string;
  daily_budget: string;
  budget_remaining: string;
  buying_type: string;
  special_ad_categories?: string[];
  special_ad_category: string;
  insights?: {
    data?: {
      impressions?: string;
      clicks?: string;
      spend?: string;
      ctr?: string;
      cpc?: string;
      cpm?: string;
      reach?: string;
      frequency?: string;
      date_start?: string;
      date_stop?: string;
    }[];
  };
}

interface Ad {
  id: string;
  name: string;
  status: string;
  createdTime: string;
  updatedTime: string;
  insights?: {
    data?: {
      impressions?: string;
      clicks?: string;
      spend?: string;
      ctr?: string;
      cpc?: string;
      cpm?: string;
      reach?: string;
      frequency?: string;
      date_start?: string;
      date_stop?: string;
      actions?: { action_type: string; value: string }[];
    }[];
  };
  creative?: any;
}

interface Adset {
  id: string;
  name: string;
  status: string;
  effective_status: string;
  budget_remaining: string;
  created_time: string;
  updated_time: string;
  start_time: string;
  end_time: string;
  optimization_goal: string;
  targeting?: {
    age_min?: number;
    age_max?: number;
    genders?: string[];
    flexible_spec?: { interests?: { name: string }[] }[];
    geo_locations?: { cities?: { name: string }[] } | { name: string }[];
  };
  insights?: {
    data?: {
      impressions?: string;
      clicks?: string;
      spend?: string;
      ctr?: string;
      cpc?: string;
      cpm?: string;
      reach?: string;
      frequency?: string;
      date_start?: string;
      date_stop?: string;
    }[];
  };
  ads?: Ad[];
}

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [adsetDetails, setAdsetDetails] = useState<Adset[]>([]);
  const [adDetails, setAdDetails] = useState<Ad | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAdsetEditPopupOpen, setIsAdsetEditPopupOpen] = useState(false);
  const [isAdEditPopupOpen, setIsAdEditPopupOpen] = useState(false);
  const [selectedAdset, setSelectedAdset] = useState<Adset | null>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      setLoading(true);
      try {
        const mockCampaign: Campaign = {
          id: '1',
          name: 'Mock Campaign 1',
          account_id: 'mockAccountId',
          status: 'active',
          effective_status: 'active',
          objective: 'Mock Objective',
          created_time: '2023-01-01',
          updated_time: '2023-12-31',
          start_time: '2023-01-01',
          daily_budget: '1000',
          budget_remaining: '500',
          buying_type: 'Auction',
          special_ad_category: 'None',
          special_ad_categories: [],
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
                date_start: '2023-01-01',
                date_stop: '2023-12-31',
              },
            ],
          },
        };
        setCampaign(mockCampaign);

        const mockAdsets: Adset[] = [
          {
            id: 'adset1',
            name: 'Adset 1',
            status: 'active',
            effective_status: 'active',
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
            ads: [
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
            ],
          },
        ];
        setAdsetDetails(mockAdsets);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  const handleAdsetClick = useCallback(
    async (adsetId: string) => {
      try {
        const mockAds: Ad[] = [
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
        ];
        const mockAdsetInsights = [
          {
            impressions: '1000',
            clicks: '50',
            spend: '200',
            ctr: '5%',
            cpc: '4',
            cpm: '20',
          },
        ];

        setAdsetDetails((prevAdsets) =>
          prevAdsets.map((adset) =>
            adset.id === adsetId ? { ...adset, ads: mockAds, insights: { data: mockAdsetInsights } } : adset
          )
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Failed to fetch adset details: ${message}`);
      }
    },
    []
  );

  const handleAdClick = async () => {
    try {
      const mockAdDetails: Ad = {
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
      };
      setAdDetails(mockAdDetails);
    } catch (error) {
      console.error('Error fetching ad details:', error);
    }
  };

  const handleEditCampaign = () => {
    setIsEditPopupOpen(true);
  };

  const handleEditAdset = (adset: Adset) => {
    setSelectedAdset(adset);
    setIsAdsetEditPopupOpen(true);
  };

  const handleEditAd = (ad: Ad) => {
    setSelectedAd(ad);
    setIsAdEditPopupOpen(true);
  };

  const handleSaveCampaign = async (updatedCampaign: Partial<Campaign>) => {
    try {
      setCampaign((prevCampaign) => (prevCampaign ? { ...prevCampaign, ...updatedCampaign } : null));
      setIsEditPopupOpen(false);
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Error updating campaign. Please try again.');
    }
  };

  const handleSaveAdset = (updatedAdset: Adset) => {
    setAdsetDetails((prevAdsets) =>
      prevAdsets.map((adset) => (adset.id === updatedAdset.id ? updatedAdset : adset))
    );
    setIsAdsetEditPopupOpen(false);
  };

  const handleSaveAd = (updatedAd: Ad) => {
    setAdDetails(updatedAd);
    setIsAdEditPopupOpen(false);
  };

  const handleCreateAd = async (adSetId: string) => {
    const adName = prompt('Enter the name of the new ad:');
    if (!adName) return alert('Ad name is required.');

    const adContent = prompt('Enter the content of the new ad:');
    if (!adContent) return alert('Ad content is required.');

    try {
      const newAd: Ad = {
        id: 'newAdId',
        name: adName,
        status: 'active',
        createdTime: new Date().toISOString(),
        updatedTime: new Date().toISOString(),
        insights: {
          data: [
            {
              impressions: '0',
              clicks: '0',
              spend: '0',
              ctr: '0%',
              cpc: '0',
              cpm: '0',
            },
          ],
        },
        creative: {
          title: 'New Creative Title',
          description: adContent,
          image_url: 'https://via.placeholder.com/150',
        },
      };

      setAdsetDetails((prevAdsets) =>
        prevAdsets.map((adset) =>
          adset.id === adSetId ? { ...adset, ads: [...(adset.ads || []), newAd] } : adset
        )
      );
      alert('Ad created successfully!');
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('Error creating ad. Please try again.');
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  if (!campaign) {
    return <div>No campaign details available.</div>;
  }

  return (
    <div className="campaign-details">
      <CampaignOverview campaign={campaign} onEditCampaign={handleEditCampaign} />
      <AnalyticsPanel
        adsetDetails={adsetDetails}
        adDetails={adDetails}
        onAdsetClick={handleAdsetClick}
        onAdClick={handleAdClick}
        onCreateAd={handleCreateAd}
        onEditAdset={handleEditAdset}
        onEditAd={handleEditAd}
      />
      <ActionButtons
        onAdsetClick={handleAdsetClick}
        onAdClick={handleAdClick}
        onCreateAd={handleCreateAd}
        onEditAdset={handleEditAdset}
        onEditAd={handleEditAd}
      />
      {loading && <LoadingSpinner />}
      {isEditPopupOpen && (
        <CampaignEditPopup
          campaign={campaign}
          onClose={() => setIsEditPopupOpen(false)}
          onSave={handleSaveCampaign}
        />
      )}
      {isAdsetEditPopupOpen && selectedAdset && (
        <AdsetEditPopup
          adset={selectedAdset}
          onClose={() => setIsAdsetEditPopupOpen(false)}
          onSave={handleSaveAdset}
        />
      )}
      {isAdEditPopupOpen && selectedAd && (
        <AdEditPopup
          ad={selectedAd}
          onClose={() => setIsAdEditPopupOpen(false)}
          onSave={handleSaveAd}
        />
      )}
    </div>
  );
};

export default CampaignDetails;
