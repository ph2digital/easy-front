import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import './styles/CampaignEditPopup.css';

interface CampaignEditPopupProps {
  campaign: any;
  onClose: () => void;
  onSave: (updatedCampaign: any, accessToken: string) => void;
}

const CampaignEditPopup: React.FC<CampaignEditPopupProps> = ({ campaign, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: campaign.name || '',
    status: campaign.status || '',
    startDate: campaign.startDate || '',
    endDate: campaign.endDate || '',
    budget: campaign.budget || '',
    objective: campaign.objective || '',
    specialAdCategories: campaign.specialAdCategories || '',
    dailyBudget: campaign.dailyBudget || '',
    lifetimeBudget: campaign.lifetimeBudget || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken: string | null = useSelector((state: RootState) => state.auth.accessToken);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fieldsToUpdate = Object.keys(formData).reduce((acc, key) => {
        if (formData[key as keyof typeof formData] !== campaign[key as keyof typeof formData]) {
          (acc as any)[key] = formData[key as keyof typeof formData];
        }
        return acc;
      }, {} as Partial<typeof formData>);

      if (accessToken) {
        onSave(fieldsToUpdate, accessToken);
      } else {
        setError('Access token is missing.');
      }
    } catch (error) {
      setError('Erro ao salvar campanha. Por favor, tente novamente.');
      console.error('Error saving campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Editar Campanha</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome da Campanha:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="active">Ativo</option>
            <option value="paused">Pausado</option>
            <option value="completed">Concluído</option>
          </select>
          <label>Data de Início:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          <label>Data de Término:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          <label>Orçamento:</label>
          <input type="number" name="budget" value={formData.budget} onChange={handleChange} />
          <label>Objetivo:</label>
          <input type="text" name="objective" value={formData.objective} onChange={handleChange} />
          <label>Categoria de Anúncio Especial:</label>
          <input type="text" name="specialAdCategories" value={formData.specialAdCategories} onChange={handleChange} />
          <label>Orçamento Diário:</label>
          <input type="number" name="dailyBudget" value={formData.dailyBudget} onChange={handleChange} />
          <label>Orçamento Vitalício:</label>
          <input type="number" name="lifetimeBudget" value={formData.lifetimeBudget} onChange={handleChange} />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default CampaignEditPopup;
