import React, { useState } from 'react';
import './styles/CampaignCreation.css';
import { useDispatch } from 'react-redux';
import { createCampaign as createCampaignAction } from '../store/campaignSlice';
import { mockCreateCampaign } from '../services/mockData';

interface Campaign {
    id: string;
    userId: string;
    mode: 'manual' | 'guided' | 'automatic';
    name: string;
    status: 'active' | 'paused' | 'completed';
    startDate: string;
    endDate: string;
    budget: any;
    objective: string;
    ads: { name: string; content: string }[];
}

const CampaignCreation: React.FC = () => {
    const [mode, setMode] = useState<string>('manual');
    const [campaignData, setCampaignData] = useState<Campaign>({
        id: '',
        userId: '',
        mode: 'manual',
        name: 'Campaign ' + Math.floor(Math.random() * 1000),
        status: 'paused',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: '4999',
        objective: 'OUTCOME_TRAFFIC',
        ads: [{ name: 'Ad ' + Math.floor(Math.random() * 1000), content: 'Content ' + Math.floor(Math.random() * 1000) }]
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const dispatch = useDispatch();

    const handleCreateCampaign = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mockCreateCampaign({
                ...campaignData,
                startDate: new Date(campaignData.startDate).toISOString(),
                endDate: new Date(campaignData.endDate).toISOString(),
                mode
            });
            dispatch(createCampaignAction(response));
            console.log('Campaign created successfully:', response);
            setShowPopup(true);
        } catch (error) {
            console.error('Error creating campaign:', error);
            setError('Erro ao criar campanha. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCampaignData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.warn('Nenhum arquivo selecionado para upload.');
            setError('Por favor, selecione pelo menos um arquivo.');
            return;
        }
        // Handle file upload logic here
        console.log('Files selected for upload:', e.target.files);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="campaign-creation">
            <h2>Criar Campanha</h2>
            <div className="mode-buttons">
                <button onClick={() => setMode('guided')}>Guiado</button>
                <button onClick={() => setMode('manual')}>Manual</button>
                <button onClick={() => setMode('automatic')}>Automático</button>
            </div>
            <div className="campaign-form">
                <label>Nome da Campanha:</label>
                <input type="text" name="name" value={campaignData.name} onChange={handleChange} />
                <label>Data de Início:</label>
                <input type="date" name="startDate" value={campaignData.startDate} onChange={handleChange} />
                <label>Data de Término:</label>
                <input type="date" name="endDate" value={campaignData.endDate} onChange={handleChange} />
                <label>Orçamento:</label>
                <input type="number" name="budget" value={campaignData.budget} onChange={handleChange} />
                <label>Objetivo:</label>
                <select name="objective" value={campaignData.objective} onChange={handleChange}>
                    <option value="OUTCOME_TRAFFIC">Tráfego</option>
                    <option value="OUTCOME_ENGAGEMENT">Engajamento</option>
                    <option value="OUTCOME_CONVERSIONS">Conversões</option>
                </select>
            </div>
            <div className="upload-section">
                <h3>Upload de Mídia</h3>
                <input type="file" multiple onChange={handleUploadFiles} />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="create-campaign-button" onClick={handleCreateCampaign} disabled={loading}>
                {loading ? 'Criando...' : 'Criar Campanha'}
            </button>
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Campanha Criada com Sucesso!</h3>
                        <button onClick={closePopup}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignCreation;
