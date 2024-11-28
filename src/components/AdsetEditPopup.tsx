import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateMetaAdsAdset } from '../services/api'; // Certifique-se de importar a função correta
import './styles/AdsetEditPopup.css';

interface AdsetEditPopupProps {
  adset: any;
  onClose: () => void;
  onSave: (updatedAdset: any) => void; // Remova o accessToken daqui
}

const AdsetEditPopup: React.FC<AdsetEditPopupProps> = ({ adset, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: adset.name || '',
    status: adset.status || '',
    startDate: adset.startDate || '',
    endDate: adset.endDate || '',
    budget: adset.budget || '',
    optimizationGoal: adset.optimizationGoal || '',
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
        if (formData[key as keyof typeof formData] !== adset[key as keyof typeof formData]) {
          (acc as any)[key] = formData[key as keyof typeof formData];
        }
        return acc;
      }, {} as Partial<typeof formData>);

      if (accessToken) {
        await updateMetaAdsAdset(adset.id, fieldsToUpdate, accessToken); // Certifique-se de que a função correta está sendo chamada
        onSave(fieldsToUpdate); // Chame onSave sem o accessToken
      } else {
        setError('Access token is missing.');
      }
    } catch (error) {
      setError('Erro ao salvar conjunto. Por favor, tente novamente.');
      console.error('Error saving adset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Editar Conjunto</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome do Conjunto:</label>
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
          <label>Objetivo de Otimização:</label>
          <input type="text" name="optimizationGoal" value={formData.optimizationGoal} onChange={handleChange} />
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

export default AdsetEditPopup;
