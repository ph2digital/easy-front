// src/pages/CampaignCreation.tsx
import React, { useState } from 'react';
import CampaignCreationForm from '../components/CampaignCreationForm';
import { createCampaign } from '../services/api';
import './styles/CampaignCreation.css';
import { useDispatch, useSelector } from 'react-redux';
import { createCampaign as createCampaignAction } from '../store/campaignSlice';
import { RootState } from '../store';

const CampaignCreation: React.FC = () => {
    const [mode, setMode] = useState<string>('manual');
    const [campaignData, setCampaignData] = useState<{
        id: string;
        userId: string;
        mode: string;
        name: string;
        status: 'active' | 'paused' | 'completed';
        startDate: string;
        endDate: string;
        budget: number;
        ads: { name: string; content: string }[];
    }>({
        id: '',
        userId: '',
        mode: 'manual',
        name: '',
        status: 'active',
        startDate: '',
        endDate: '',
        budget: 0,
        ads: []
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const accountId = useSelector((state: RootState) => state.auth.user.external_id);
    const dispatch = useDispatch();
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    const storedActiveCustomers = JSON.parse(localStorage.getItem('activeCustomers') || '[]');

    const customerId = storedActiveCustomers?.[0]?.customer_id
    console.log(`customer_id: ${customerId}`);

    const handleCreateCampaign = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!accessToken) {
                setError('Access token is missing.');
                setLoading(false);
                return;
            }
            const response = await createCampaign(accessToken, {
                customerId,
                ...campaignData,
                mode: campaignData.mode as 'manual' | 'guided' | 'automatic',
                ads: campaignData.ads.map(ad => ({
                    name: ad.name,
                    ads: [{ name: ad.name, creative_id: 'YOUR_CREATIVE_ID', content: ad.content }],
                })),
            });
            dispatch(createCampaignAction(response));
            console.log('Campaign created successfully:', response);
        } catch (error) {
            console.error('Error creating campaign:', error);
            setError('Erro ao criar campanha. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCampaignData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCampaignData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddAd = () => {
        setCampaignData(prevState => ({
            ...prevState,
            ads: [...prevState.ads, { name: '', content: '' }]
        }));
    };

    const handleAdChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const ads = [...campaignData.ads];
        ads[index] = { ...ads[index], [name]: value };
        setCampaignData(prevState => ({
            ...prevState,
            ads
        }));
    };

    return (
        <div className="campaign-creation">
            <h2>Criar Campanha</h2>
            <div className="mode-buttons">
                <select name="status" value={campaignData.status} onChange={handleSelectChange} required></select>
                <button onClick={() => setMode('guided')}>Guiado</button>
                <button onClick={() => setMode('manual')}>Manual</button>
            </div>
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
                <button onClick={handleAddAd}>Adicionar Anúncio</button>
                {campaignData.ads.map((ad, index) => (
                    <div key={index} className="ad-form">
                        <label>Nome do Anúncio:</label>
                        <input type="text" name="name" value={ad.name} onChange={(e) => handleAdChange(index, e)} required />
                        <label>Conteúdo do Anúncio:</label>
                        <input type="text" name="content" value={ad.content} onChange={(e) => handleAdChange(index, e)} required />
                    </div>
                ))}
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="create-campaign-button" onClick={handleCreateCampaign} disabled={loading}>
                {loading ? 'Criando...' : 'Criar Campanha'}
            </button>
            <CampaignCreationForm mode={mode as 'manual' | 'guided' | 'automatic'} />
        </div>
    );
};

export default CampaignCreation;
