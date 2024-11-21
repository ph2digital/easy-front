import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaAdsCampaignDetails, fetchMetaAdsAdsets, fetchMetaAdsAds, fetchMetaAdsAdDetails } from '../services/authService';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import './styles/CampaignDetails.css';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  objective: string;
  budget: string;
  status: string;
  startDate: string;
  endDate: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  adsets?: Adset[];
}

interface Adset {
  id: string;
  name: string;
  status: string;
  dailyBudget: string;
  startDate: string;
  endDate: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ads?: Ad[];
}

interface Ad {
  id: string;
  name: string;
  status: string;
  createdTime: string;
  updatedTime: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  creative?: any;
  insights?: any;
}

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [adsetDetails, setAdsetDetails] = useState<Adset[]>([]);
  const [adDetails, setAdDetails] = useState<Ad | null>(null);
  const accessToken: string | null = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (accessToken && id) {
        try {
          const campaignDetails = await fetchMetaAdsCampaignDetails(accessToken, id);
          setCampaign(campaignDetails);

          const adsetsResponse = await fetchMetaAdsAdsets(accessToken, id);
          setAdsetDetails(adsetsResponse);
        } catch (error) {
          console.error('Error fetching campaign details:', error);
        }
      }
    };

    fetchCampaignDetails();
  }, [accessToken, id]);

  const handleAdsetClick = async (adsetId: string) => {
    if (accessToken) {
      try {
        const adsResponse = await fetchMetaAdsAds(accessToken, adsetId);
        setAdsetDetails((prevAdsets) =>
          prevAdsets.map((adset) =>
            adset.id === adsetId ? { ...adset, ads: adsResponse } : adset
          )
        );
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    }
  };

  const handleAdClick = async (adId: string) => {
    if (accessToken) {
      try {
        const details = await fetchMetaAdsAdDetails(accessToken, adId);
        setAdDetails(details);
      } catch (error) {
        console.error('Error fetching ad details:', error);
      }
    }
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div className="campaign-details">
      <h2>Detalhes da Campanha</h2>
      <div className="campaign-info">
        <p><strong>ID:</strong> {campaign.id}</p>
        <p><strong>Nome:</strong> {campaign.name}</p>
        <p><strong>Plataforma:</strong> {campaign.platform}</p>
        <p><strong>Objetivo:</strong> {campaign.objective}</p>
        <p><strong>Orçamento:</strong> {campaign.budget}</p>
        <p><strong>Status:</strong> {campaign.status}</p>
        <p><strong>Período:</strong> {campaign.startDate} - {campaign.endDate}</p>
        <p><strong>Gastos:</strong> {campaign.spend}</p>
        <p><strong>Impressões:</strong> {campaign.impressions}</p>
        <p><strong>Cliques:</strong> {campaign.clicks}</p>
      </div>
      <h3>Conjuntos de Anúncios</h3>
      {adsetDetails.map((adset) => (
        <div key={adset.id} className="adset-details" onClick={() => handleAdsetClick(adset.id)}>
          <h4>{adset.name}</h4>
          <p><strong>Status:</strong> {adset.status}</p>
          <p><strong>Orçamento Diário:</strong> {adset.dailyBudget}</p>
          <p><strong>Período:</strong> {adset.startDate} - {adset.endDate}</p>
          <p><strong>Gastos:</strong> {adset.spend}</p>
          <p><strong>Impressões:</strong> {adset.impressions}</p>
          <p><strong>Cliques:</strong> {adset.clicks}</p>
          <h5>Anúncios</h5>
          {adset.ads && adset.ads.map((ad) => (
            <div key={ad.id} className="ad-details" onClick={() => handleAdClick(ad.id)}>
              <p><strong>ID:</strong> {ad.id}</p>
              <p><strong>Nome:</strong> {ad.name}</p>
              <p><strong>Status:</strong> {ad.status}</p>
              <p><strong>Criado em:</strong> {ad.createdTime}</p>
              <p><strong>Atualizado em:</strong> {ad.updatedTime}</p>
              <p><strong>Gastos:</strong> {ad.spend}</p>
              <p><strong>Impressões:</strong> {ad.impressions}</p>
              <p><strong>Cliques:</strong> {ad.clicks}</p>
            </div>
          ))}
        </div>
      ))}
      {adDetails && (
        <div className="ad-info">
          <h4>Detalhes do Anúncio</h4>
          <p><strong>ID:</strong> {adDetails.id}</p>
          <p><strong>Nome:</strong> {adDetails.name}</p>
          <p><strong>Status:</strong> {adDetails.status}</p>
          <p><strong>Criado em:</strong> {adDetails.createdTime}</p>
          <p><strong>Atualizado em:</strong> {adDetails.updatedTime}</p>
          <p><strong>Gastos:</strong> {adDetails.spend}</p>
          <p><strong>Impressões:</strong> {adDetails.impressions}</p>
          <p><strong>Cliques:</strong> {adDetails.clicks}</p>
          <p><strong>CTR:</strong> {adDetails.ctr}</p>
          <p><strong>CPC:</strong> {adDetails.cpc}</p>
          <p><strong>CPM:</strong> {adDetails.cpm}</p>
          <p><strong>Creative:</strong> {JSON.stringify(adDetails.creative)}</p>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;