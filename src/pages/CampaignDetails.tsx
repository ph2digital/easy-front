import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaAdsCampaignDetails, fetchMetaAdsAdsets, fetchMetaAdsAds, fetchMetaAdsAdDetails } from '../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
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
  special_ad_categories: string[];
  special_ad_category: string;
  insights: {
    data: {
      impressions: string;
      clicks: string;
      spend: string;
      ctr: string;
      cpc: string;
      cpm: string;
      reach: string;
      frequency: string;
      date_start: string;
      date_stop: string;
    }[];
  };
  source_campaign_id: string;
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
  targeting: {
    age_max: number;
    age_min: number;
    flexible_spec: {
      interests: {
        id: string;
        name: string;
      }[];
    }[];
    geo_locations: {
      cities: {
        country: string;
        distance_unit: string;
        key: string;
        name: string;
        radius: number;
        region: string;
        region_id: string;
      }[];
      regions: {
        key: string;
        name: string;
        country: string;
      }[];
      location_types: string[];
    };
    targeting_optimization: string;
    brand_safety_content_filter_levels: string[];
    targeting_automation: {
      advantage_audience: number;
    };
    publisher_platforms: string[];
    facebook_positions: string[];
    instagram_positions: string[];
    device_platforms: string[];
  };
  optimization_goal: string;
  insights: {
    data: {
      impressions: string;
      clicks: string;
      spend: string;
      ctr: string;
      cpc: string;
      cpm: string;
      reach: string;
      frequency: string;
      date_start: string;
      date_stop: string;
    }[];
  };
  ads?: Ad[];
}

interface Ad {
  id: string;
  name: string;
  status: string;
  created_time: string;
  updated_time: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  creative?: any;
  insights?: {
    data: {
      account_currency: string;
      account_id: string;
      account_name: string;
      actions: {
        action_type: string;
        value: string;
      }[];
      ad_id: string;
      ad_name: string;
      adset_id: string;
      adset_name: string;
      campaign_id: string;
      campaign_name: string;
      clicks: string;
      cost_per_action_type: {
        action_type: string;
        value: string;
      }[];
      cpc: string;
      cpm: string;
      ctr: string;
      frequency: string;
      impressions: string;
      reach: string;
      spend: string;
      video_30_sec_watched_actions: {
        action_type: string;
        value: string;
      }[];
      video_avg_time_watched_actions: {
        action_type: string;
        value: string;
      }[];
      video_play_actions: {
        action_type: string;
        value: string;
      }[];
      date_start: string;
      date_stop: string;
    }[];
  };
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
        <p><strong>Conta:</strong> {campaign.account_id}</p>
        <p><strong>Status:</strong> {campaign.status}</p>
        <p><strong>Status Efetivo:</strong> {campaign.effective_status}</p>
        <p><strong>Objetivo:</strong> {campaign.objective}</p>
        <p><strong>Criado em:</strong> {campaign.created_time}</p>
        <p><strong>Atualizado em:</strong> {campaign.updated_time}</p>
        <p><strong>Início:</strong> {campaign.start_time}</p>
        <p><strong>Orçamento Diário:</strong> {campaign.daily_budget}</p>
        <p><strong>Orçamento Restante:</strong> {campaign.budget_remaining}</p>
        <p><strong>Tipo de Compra:</strong> {campaign.buying_type}</p>
        <p><strong>Categorias de Anúncio Especial:</strong> {campaign.special_ad_categories.join(', ')}</p>
        <p><strong>Categoria de Anúncio Especial:</strong> {campaign.special_ad_category}</p>
        <p><strong>Impressões:</strong> {campaign.insights.data[0].impressions}</p>
        <p><strong>Cliques:</strong> {campaign.insights.data[0].clicks}</p>
        <p><strong>Gastos:</strong> {campaign.insights.data[0].spend}</p>
        <p><strong>CTR:</strong> {campaign.insights.data[0].ctr}</p>
        <p><strong>CPC:</strong> {campaign.insights.data[0].cpc}</p>
        <p><strong>CPM:</strong> {campaign.insights.data[0].cpm}</p>
        <p><strong>Alcance:</strong> {campaign.insights.data[0].reach}</p>
        <p><strong>Frequência:</strong> {campaign.insights.data[0].frequency}</p>
        <p><strong>Data de Início:</strong> {campaign.insights.data[0].date_start}</p>
        <p><strong>Data de Término:</strong> {campaign.insights.data[0].date_stop}</p>
      </div>
      <h3>Conjuntos de Anúncios</h3>
      {adsetDetails.map((adset) => (
        <div key={adset.id} className="adset-details" onClick={() => handleAdsetClick(adset.id)}>
          <h4>{adset.name}</h4>
          <p><strong>Status:</strong> {adset.status}</p>
          <p><strong>Status Efetivo:</strong> {adset.effective_status}</p>
          <p><strong>Orçamento Restante:</strong> {adset.budget_remaining}</p>
          <p><strong>Criado em:</strong> {adset.created_time}</p>
          <p><strong>Atualizado em:</strong> {adset.updated_time}</p>
          <p><strong>Início:</strong> {adset.start_time}</p>
          <p><strong>Otimização:</strong> {adset.optimization_goal}</p>
          <p><strong>Impressões:</strong> {adset.insights.data[0].impressions}</p>
          <p><strong>Cliques:</strong> {adset.insights.data[0].clicks}</p>
          <p><strong>Gastos:</strong> {adset.insights.data[0].spend}</p>
          <p><strong>CTR:</strong> {adset.insights.data[0].ctr}</p>
          <p><strong>CPC:</strong> {adset.insights.data[0].cpc}</p>
          <p><strong>CPM:</strong> {adset.insights.data[0].cpm}</p>
          <p><strong>Alcance:</strong> {adset.insights.data[0].reach}</p>
          <p><strong>Frequência:</strong> {adset.insights.data[0].frequency}</p>
          <h5>Anúncios</h5>
          {adset.ads && adset.ads.map((ad) => (
            <div key={ad.id} className="ad-details" onClick={() => handleAdClick(ad.id)}>
              <p><strong>ID:</strong> {ad.id}</p>
              <p><strong>Nome:</strong> {ad.name}</p>
              <p><strong>Status:</strong> {ad.status}</p>
              <p><strong>Criado em:</strong> {ad.created_time}</p>
              <p><strong>Atualizado em:</strong> {ad.updated_time}</p>
              <p><strong>Gastos:</strong> {ad.insights?.data[0].spend}</p>
              <p><strong>Impressões:</strong> {ad.insights?.data[0].impressions}</p>
              <p><strong>Cliques:</strong> {ad.insights?.data[0].clicks}</p>
              <p><strong>CTR:</strong> {ad.insights?.data[0].ctr}</p>
              <p><strong>CPC:</strong> {ad.insights?.data[0].cpc}</p>
              <p><strong>CPM:</strong> {ad.insights?.data[0].cpm}</p>
              <p><strong>Ações:</strong> {ad.insights?.data[0].actions.map(action => `${action.action_type}: ${action.value}`).join(', ')}</p>
              {/* <p><strong>Especificações de Rastreamento:</strong> {ad.tracking_specs.map(spec => `${Object.keys(spec)[0]}: ${Object.values(spec)[0].join(', ')}`).join('; ')}</p> */}
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
          <p><strong>Criado em:</strong> {adDetails.created_time}</p>
          <p><strong>Atualizado em:</strong> {adDetails.updated_time}</p>
          <p><strong>Gastos:</strong> {adDetails.insights?.data[0].spend}</p>
          <p><strong>Impressões:</strong> {adDetails.insights?.data[0].impressions}</p>
          <p><strong>Cliques:</strong> {adDetails.insights?.data[0].clicks}</p>
          <p><strong>CTR:</strong> {adDetails.insights?.data[0].ctr}</p>
          <p><strong>CPC:</strong> {adDetails.insights?.data[0].cpc}</p>
          <p><strong>CPM:</strong> {adDetails.insights?.data[0].cpm}</p>
          <p><strong>Creative:</strong> {JSON.stringify(adDetails.creative)}</p>
          <p><strong>Ações:</strong> {adDetails.insights?.data[0].actions.map(action => `${action.action_type}: ${action.value}`).join(', ')}</p>
          {/* <p><strong>Especificações de Rastreamento:</strong> {adDetails.tracking_specs.map(spec => `${Object.keys(spec)[0]}: ${Object.values(spec)[0].join(', ')}`).join('; ')}</p> */}
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;