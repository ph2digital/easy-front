import React from 'react';
import { Campaign } from '../../types';

interface CampaignFormProps {
  campaignData: Campaign;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAddAd: () => void;
  handleAdChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  campaignData,
  handleChange,
  handleSelectChange,
  handleAddAd,
  handleAdChange,
}) => {
  return (
    <div className="campaign-form">
      <label>Nome da Campanha:</label>
      <input type="text" name="name" value={campaignData.name} onChange={handleChange} required />
      <label>Status:</label>
      <select name="status" value={campaignData.status} onChange={handleSelectChange} required>
        <option value="active">Ativo</option>
        <option value="paused">Pausado</option>
        <option value="completed">Concluído</option>
      </select>
      <label>Data de Início:</label>
      <input type="date" name="startDate" value={campaignData.startDate} onChange={handleChange} required />
      <label>Data de Término:</label>
      <input type="date" name="endDate" value={campaignData.endDate} onChange={handleChange} required />
      <label>Orçamento:</label>
      <input type="number" name="budget" value={campaignData.budget} onChange={handleChange} required />
      <label>Objetivo:</label>
      <select name="objective" value={campaignData.objective} onChange={handleSelectChange} required>
        <option value="OUTCOME_TRAFFIC">Tráfego</option>
        <option value="OUTCOME_ENGAGEMENT">Engajamento</option>
        <option value="OUTCOME_CONVERSIONS">Conversões</option>
      </select>
      <label>Categorias Especiais de Anúncios:</label>
      <input type="text" name="specialAdCategories" value={campaignData.specialAdCategories.join(', ')} onChange={handleChange} placeholder="Separar por vírgulas" />
      <button onClick={handleAddAd}>Adicionar Conjunto de Anúncios</button>
      {campaignData.ads.map((adSet: any, index: number) => (
        <div key={index} className="ad-form">
          <label>Nome do Conjunto de Anúncios:</label>
          <input type="text" name="name" value={adSet.name} onChange={(e) => handleAdChange(index, e)} required />
          <label>Conteúdo do Conjunto de Anúncios:</label>
          <input type="text" name="content" value={adSet.content} onChange={(e) => handleAdChange(index, e)} required />
          <button onClick={() => handleAddAd()}>Adicionar Anúncio</button>
          {adSet.ads.map((ad: any, adIndex: number) => (
            <div key={adIndex} className="ad-form">
              <label>Nome do Anúncio:</label>
              <input type="text" name="name" value={ad.name} onChange={(e) => handleAdChange(adIndex, e)} required />
              <label>ID do Criativo:</label>
              <input type="text" name="creative_id" value={ad.creative_id} onChange={(e) => handleAdChange(adIndex, e)} required />
              <label>Status:</label>
              <select name="status" value={ad.status} onChange={(e) => handleAdChange(adIndex, e)} required>
                <option value="PAUSED">Pausado</option>
                <option value="ACTIVE">Ativo</option>
              </select>
              <label>Valor do Lance:</label>
              <input type="number" name="bid_amount" value={ad.bid_amount} onChange={(e) => handleAdChange(adIndex, e)} required />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CampaignForm;