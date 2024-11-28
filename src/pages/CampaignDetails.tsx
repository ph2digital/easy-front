import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  fetchMetaAdsCampaignDetails,
  fetchMetaAdsAdsets,
  fetchMetaAdsAds,
  fetchMetaAdsAdDetails,
  createMetaAdsAd,
  fetchMetaAdsCampaignInsights,
  fetchMetaAdsAdsetInsights,
  fetchMetaAdsAdInsights,
  updateMetaAdsCampaign
} from '../services/api';
import AdsetList from '../components/AdsetList';
import CampaignInfo from '../components/CampaignInfo';
import LoadingSpinner from '../components/LoadingSpinner';
import CampaignEditPopup from '../components/CampaignEditPopup';
import AdsetEditPopup from '../components/AdsetEditPopup';
import AdEditPopup from '../components/AdEditPopup';
import './styles/CampaignDetails.css';

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
  const location = useLocation();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [adsetDetails, setAdsetDetails] = useState<Adset[]>([]);
  const [adDetails, setAdDetails] = useState<Ad | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAdsetEditPopupOpen, setIsAdsetEditPopupOpen] = useState(false);
  const [isAdEditPopupOpen, setIsAdEditPopupOpen] = useState(false);
  const [selectedAdset, setSelectedAdset] = useState<Adset | null>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const editType = new URLSearchParams(location.search).get('edit');
  const accessToken: string | null = useSelector((state: RootState) => state.auth.accessToken);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!accessToken || !id) return;

      setLoading(true);
      try {
        const campaignDetails = await fetchMetaAdsCampaignDetails(accessToken, id);
        setCampaign(campaignDetails);
        const adsetsResponse = await fetchMetaAdsAdsets(accessToken, id);
        setAdsetDetails(adsetsResponse);
        const campaignInsights = await fetchMetaAdsCampaignInsights(accessToken, id);
        setCampaign((prevCampaign) =>
          prevCampaign ? { ...prevCampaign, insights: { data: campaignInsights } } : null
        );
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [accessToken, id]);

  const handleAdsetClick = useCallback(
    async (adsetId: string) => {
      if (!accessToken) return;

      try {
        const adsResponse = await fetchMetaAdsAds(accessToken, adsetId);
        const adsetInsights = await fetchMetaAdsAdsetInsights(accessToken, adsetId);

        setAdsetDetails((prevAdsets) =>
          prevAdsets.map((adset) =>
            adset.id === adsetId ? { ...adset, ads: adsResponse, insights: { data: adsetInsights } } : adset
          )
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Failed to fetch adset details: ${message}`);
      }
    },
    [accessToken]
  );

  const handleAdClick = async (adId: string) => {
    if (accessToken) {
      try {
        const details = await fetchMetaAdsAdDetails(accessToken, adId);
        const adInsights = await fetchMetaAdsAdInsights(accessToken, adId);
        setAdDetails({ ...details, createdTime: details.created_time, updatedTime: details.updated_time, insights: { data: adInsights } });
      } catch (error) {
        console.error('Error fetching ad details:', error);
      }
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

  const handleSaveCampaign = async (updatedCampaign: Partial<Campaign>, accessToken: string) => {
    if (!accessToken || !id) return;

    try {
      const fieldsToUpdate = Object.keys(updatedCampaign).reduce((acc, key) => {
        if (updatedCampaign[key as keyof Campaign] !== campaign?.[key as keyof Campaign]) {
          (acc as any)[key] = updatedCampaign[key as keyof Campaign];
        }
        return acc;
      }, {} as Partial<Campaign>);

      await updateMetaAdsCampaign(id, fieldsToUpdate, accessToken);
      setCampaign((prevCampaign) => (prevCampaign ? { ...prevCampaign, ...fieldsToUpdate } : null));
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
    if (!accessToken || !campaign) return;

    const adName = prompt('Enter the name of the new ad:');
    if (!adName) return alert('Ad name is required.');

    const adContent = prompt('Enter the content of the new ad:');
    if (!adContent) return alert('Ad content is required.');

    try {
      const adData = {
        customerId: campaign.account_id,
        adSetId,
        name: adName,
        creative_id: 'YOUR_CREATIVE_ID',
        content: adContent,
      };

      await createMetaAdsAd(accessToken, adData);
      alert('Ad created successfully!');
      handleAdsetClick(adSetId); // Refresh the ad set details
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('Error creating ad. Please try again.');
    }
  };

  const renderAdDetails = () => (
    <div className="ad-info">
      <h4>Detalhes do Anúncio</h4>
      <p><strong>ID:</strong> {adDetails?.id}</p>
      <p><strong>Nome:</strong> {adDetails?.name}</p>
      <p><strong>Status:</strong> {adDetails?.status}</p>
      <p><strong>Criado em:</strong> {adDetails?.createdTime}</p>
      <p><strong>Atualizado em:</strong> {adDetails?.updatedTime}</p>
      {adDetails?.insights?.data?.[0] && (
        <>
          <p><strong>Gastos:</strong> {adDetails.insights.data[0].spend}</p>
          <p><strong>Impressões:</strong> {adDetails.insights.data[0].impressions}</p>
          <p><strong>Cliques:</strong> {adDetails.insights.data[0].clicks}</p>
          <p><strong>CTR:</strong> {adDetails.insights.data[0].ctr}</p>
          <p><strong>CPC:</strong> {adDetails.insights.data[0].cpc}</p>
          <p><strong>CPM:</strong> {adDetails.insights.data[0].cpm}</p>
          <p><strong>Ações:</strong> {adDetails.insights.data[0].actions?.map((action: any) => `${action.action_type}: ${action.value}`)?.join(', ')}</p>
        </>
      )}
      <p><strong>Creative:</strong> {JSON.stringify(adDetails?.creative)}</p>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!campaign) {
    return <LoadingSpinner />;
  }

  return (
    <div className="campaign-details">
      <h2>Detalhes da Campanha</h2>
      <CampaignInfo
        campaign={campaign}
        isEditing={editType === 'campaign'}
        onEdit={handleEditCampaign}
        onSave={handleSaveCampaign}
        onEditAdset={handleEditAdset}
      />
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
      <h3>Conjuntos de Anúncios</h3>
      <AdsetList
        adsets={adsetDetails}
        onAdsetClick={handleAdsetClick}
        onAdClick={handleAdClick}
        onCreateAd={handleCreateAd}
        onEditAdset={handleEditAdset}
        onEditAd={handleEditAd}
        isEditing={editType === 'adset'}
      />
      {adDetails && renderAdDetails()}
    </div>
  );
};

export default CampaignDetails;
