import React, { useState } from 'react';
import './styles/CampaignInfo.css';

interface CampaignInfoProps {
  campaign: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedCampaign: any, accessToken: string) => void;
  onEditAdset: (adset: any) => void; // Adicione esta linha
}

const CampaignInfo: React.FC<CampaignInfoProps> = ({ campaign, isEditing, onEdit, onSave, onEditAdset }) => {
  const [editableCampaign, setEditableCampaign] = useState(campaign);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableCampaign({ ...editableCampaign, [name]: value });
  };

  const handleSave = () => {
    const accessToken = ''; // Obtenha o token de acesso de onde for necessário
    const updatedCampaign = {}; // Obtenha os dados atualizados da campanha
    onSave(updatedCampaign, accessToken);
  };

  return (
    <div className="campaign-info">
      {isEditing ? (
        <>
          <input type="text" name="name" value={editableCampaign.name} onChange={handleChange} required />
          <input type="text" name="objective" value={editableCampaign.objective} onChange={handleChange} />
          <input type="text" name="daily_budget" value={editableCampaign.daily_budget} onChange={handleChange} />
          <button onClick={handleSave}>Salvar</button>
        </>
      ) : (
        <>
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
          <p><strong>Categorias de Anúncio Especial:</strong> {campaign.special_ad_categories?.join(', ')}</p>
          <p><strong>Categoria de Anúncio Especial:</strong> {campaign.special_ad_category}</p>
          {campaign.insights?.data?.[0] && (
            <>
              <p><strong>Impressões:</strong> {campaign.insights?.data?.[0]?.impressions}</p>
              <p><strong>Cliques:</strong> {campaign.insights?.data?.[0]?.clicks}</p>
              <p><strong>Gastos:</strong> {campaign.insights?.data?.[0]?.spend}</p>
              <p><strong>CTR:</strong> {campaign.insights?.data?.[0]?.ctr}</p>
              <p><strong>CPC:</strong> {campaign.insights?.data?.[0]?.cpc}</p>
              <p><strong>CPM:</strong> {campaign.insights?.data?.[0]?.cpm}</p>
              <p><strong>Alcance:</strong> {campaign.insights?.data?.[0]?.reach}</p>
              <p><strong>Frequência:</strong> {campaign.insights?.data?.[0]?.frequency}</p>
              <p><strong>Data de Início:</strong> {campaign.insights?.data?.[0]?.date_start}</p>
              <p><strong>Data de Término:</strong> {campaign.insights?.data?.[0]?.date_stop}</p>
            </>
          )}
          <button onClick={onEdit}>Editar Campanha</button>
          <button onClick={() => onEditAdset(campaign)}>Editar Conjunto</button> {/* Adicione esta linha */}
          <button onClick={handleSave}>Salvar Campanha</button> {/* Adicione esta linha */}
        </>
      )}
    </div>
  );
};

export default CampaignInfo;
