import React, { useState } from 'react';
import { updateMetaAdsCampaign } from '../services/api';
import './CampaignEditPopup.css';

interface CampaignEditPopupProps {
  campaign: any;
  onClose: () => void;
  onSave: (updatedCampaign: any) => void;
}

const CampaignEditPopup: React.FC<CampaignEditPopupProps> = ({ campaign, onClose, onSave }) => {
  const [formData, setFormData] = useState(campaign);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: typeof formData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updatedCampaign = await updateMetaAdsCampaign(formData.id, formData);
      onSave(updatedCampaign);
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
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="active">Ativo</option>
            <option value="paused">Pausado</option>
            <option value="completed">Concluído</option>
          </select>
          <label>Data de Início:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          <label>Data de Término:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          <label>Orçamento:</label>
          <input type="number" name="budget" value={formData.budget} onChange={handleChange} required />
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
