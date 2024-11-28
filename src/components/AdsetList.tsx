import React, { useState } from 'react';
import './styles/AdsetList.css';

interface Ad {
  id: string;
  name: string;
  status: string;
  createdTime: string;
  updatedTime: string;
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

interface AdsetListProps {
  adsets: Adset[];
  onAdsetClick: (adsetId: string) => void;
  onAdClick: (adId: string) => void;
  onCreateAd: (adSetId: string) => void;
  onEditAdset: (adset: Adset) => void;
  onEditAd: (ad: Ad) => void;
  isEditing: boolean;
}

const AdsetList: React.FC<AdsetListProps> = ({ adsets, onAdsetClick, onAdClick, onCreateAd, onEditAdset, onEditAd, isEditing }) => {
  const [editableAdset, setEditableAdset] = useState<Adset | null>(null);

  const handleAdsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableAdset) {
      const { name, value } = e.target;
      setEditableAdset({ ...editableAdset, [name]: value });
    }
  };

  const handleSaveAdset = () => {
    if (editableAdset) {
      onEditAdset(editableAdset);
      setEditableAdset(null);
    }
  };

  return (
    <div className="adset-list">
      {adsets.length > 0 ? adsets.map((adset) => (
        <div key={adset.id} className="adset-item">
          {editableAdset && editableAdset.id === adset.id ? (
            <>
              <input type="text" name="name" value={editableAdset.name} onChange={handleAdsetChange} />
              <input type="text" name="status" value={editableAdset.status} onChange={handleAdsetChange} />
              <button onClick={handleSaveAdset}>Salvar</button>
            </>
          ) : (
            <>
              <h4>{adset.name}</h4>
              <button onClick={() => onAdsetClick(adset.id)}>Ver Anúncios</button>
              {!isEditing && (
                <>
                  <button onClick={() => onCreateAd(adset.id)}>Criar Anúncio</button>
                </>
              )}
              <div className="adset-details">
                <p><strong>Status:</strong> {adset.status}</p>
                <p><strong>Status Efetivo:</strong> {adset.effective_status}</p>
                <p><strong>Orçamento Restante:</strong> {adset.budget_remaining}</p>
                <p><strong>Criado em:</strong> {adset.created_time}</p>
                <p><strong>Atualizado em:</strong> {adset.updated_time}</p>
                <p><strong>Início:</strong> {adset.start_time}</p>
                <p><strong>Fim:</strong> {adset.end_time}</p>
                <p><strong>Otimização:</strong> {adset.optimization_goal}</p>
                <p><strong>Idade:</strong> {adset.targeting?.age_min} - {adset.targeting?.age_max}</p>
                <p><strong>Gênero:</strong> {adset.targeting?.genders?.join(', ')}</p>
                <p><strong>Interesses:</strong> {adset.targeting?.flexible_spec?.[0]?.interests?.map((interest: any) => interest.name)?.join(', ') || 'N/A'}</p>
                <p><strong>Localizações:</strong> {Array.isArray(adset.targeting?.geo_locations) ? adset.targeting.geo_locations.map((location: any) => 'cities' in location ? location.cities?.map((city: any) => city.name)?.join(', ') : location.name).join(', ') : 'N/A'}</p>
                {adset.insights?.data?.[0] && (
                  <>
                    <p><strong>Impressões:</strong> {adset.insights?.data?.[0]?.impressions}</p>
                    <p><strong>Cliques:</strong> {adset.insights?.data?.[0]?.clicks}</p>
                    <p><strong>Gastos:</strong> {adset.insights?.data?.[0]?.spend}</p>
                    <p><strong>CTR:</strong> {adset.insights?.data?.[0]?.ctr}</p>
                    <p><strong>CPC:</strong> {adset.insights?.data?.[0]?.cpc}</p>
                    <p><strong>CPM:</strong> {adset.insights?.data?.[0]?.cpm}</p>
                    <p><strong>Alcance:</strong> {adset.insights?.data?.[0]?.reach}</p>
                    <p><strong>Frequência:</strong> {adset.insights?.data?.[0]?.frequency}</p>
                    <p><strong>Data de Início:</strong> {adset.insights?.data?.[0]?.date_start}</p>
                    <p><strong>Data de Término:</strong> {adset.insights?.data?.[0]?.date_stop}</p>
                  </>
                )}
                {!isEditing && <button onClick={() => onEditAdset(adset)}>Editar Conjunto</button>}
              </div>
            </>
          )}
          {adset.ads && adset.ads.length > 0 && (
            <div className="ads-details">
              <h5>Anúncios</h5>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Status</th>
                    <th>Criado em</th>
                    <th>Atualizado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {adset.ads.map((ad) => (
                    <tr key={ad.id} onClick={() => onAdClick(ad.id)}>
                      <td>{ad.name}</td>
                      <td>{ad.status}</td>
                      <td>{ad.createdTime}</td>
                      <td>{ad.updatedTime}</td>
                      <td>
                        <button onClick={() => onEditAd(ad)}>Editar Anúncio</button>
                        <button onClick={() => onAdClick(ad.id)}>Ver Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )) : (
        <p>Nenhum conjunto de anúncios encontrado.</p>
      )}
    </div>
  );
};

export default AdsetList;