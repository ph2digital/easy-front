import React, { useState } from 'react';
import './styles/AdsetEditPopup.css'; // Correct import path

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

interface AdsetEditPopupProps {
  adset: Adset;
  onClose: () => void;
  onSave: (updatedAdset: Adset) => void;
}

const AdsetEditPopup: React.FC<AdsetEditPopupProps> = ({ adset, onClose, onSave }) => {
  const [editableAdset, setEditableAdset] = useState(adset);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableAdset({ ...editableAdset, [name]: value });
  };

  const handleSave = () => {
    const updatedAdset = {
      ...editableAdset,
      // Ensure optional fields are handled properly
      targeting: {
        ...editableAdset.targeting,
        age_min: editableAdset.targeting?.age_min || 0,
        age_max: editableAdset.targeting?.age_max || 0,
        genders: editableAdset.targeting?.genders || [],
        flexible_spec: editableAdset.targeting?.flexible_spec || [],
        geo_locations: editableAdset.targeting?.geo_locations || [],
      },
    };
    onSave(updatedAdset);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Editar Conjunto de Anúncios</h2>
        <label htmlFor="name">Nome</label>
        <input type="text" id="name" name="name" value={editableAdset.name} onChange={handleChange} required />
        <label htmlFor="status">Status</label>
        <input type="text" id="status" name="status" value={editableAdset.status} onChange={handleChange} required />
        <button className="save-button" onClick={handleSave}>Salvar</button>
      </div>
    </div>
  );
};

export default AdsetEditPopup;
