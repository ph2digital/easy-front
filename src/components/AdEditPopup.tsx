import React, { useState } from 'react';
import './styles/AdEditPopup.css';

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

interface AdEditPopupProps {
  ad: Ad;
  onClose: () => void;
  onSave: (updatedAd: Ad) => void;
}

const AdEditPopup: React.FC<AdEditPopupProps> = ({ ad, onClose, onSave }) => {
  const [editableAd, setEditableAd] = useState(ad);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableAd({ ...editableAd, [name]: value });
  };

  const handleSave = () => {
    const updatedAd = {
      ...editableAd,
      // Ensure optional fields are handled properly
      insights: {
        ...editableAd.insights,
        data: editableAd.insights?.data || [],
      },
      creative: editableAd.creative || {},
    };
    onSave(updatedAd);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Editar Anúncio</h2>
        <label htmlFor="name">Nome</label>
        <input type="text" id="name" name="name" value={editableAd.name} onChange={handleChange} required />
        <label htmlFor="status">Status</label>
        <input type="text" id="status" name="status" value={editableAd.status} onChange={handleChange} required />
        <button className="save-button" onClick={handleSave}>Salvar</button>
      </div>
    </div>
  );
};

export default AdEditPopup;