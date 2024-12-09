import React, { useState, useEffect } from 'react';
import CampaignCreationForm from '../components/CampaignCreationForm';
import { uploadCreativeFiles, requestCreativeBasedOnCompetitor } from '../services/api';
import './styles/CampaignCreation.css';
import { useDispatch, useSelector } from 'react-redux';
import { createCampaign as createCampaignAction } from '../store/campaignSlice';
import { RootState } from '../store';
import CampaignForm from '../components/CampaignForm'; // Import new component
import TargetAudienceSelector from '../components/TargetAudienceSelector'; // Import new component
import BudgetCalculator from '../components/BudgetCalculator'; // Ensure this path is correct or update it to the correct path
import { mockCreateCampaign, mockCreateAdSet, mockCreateAd } from '../mockData'; // Import mock functions

interface Campaign {
    id: string;
    userId: string;
    mode: 'manual' | 'guided' | 'automatic';
    name: string;
    status: 'active' | 'paused' | 'completed';
    startDate: string;
    endDate: string;
    budget: any; // Define budget as any
    objective: string;
    specialAdCategories: any[];
    clicks: number;
    impressions: number;
    ads: { name: string; content: string; targeting?: { geo_locations: { countries: string[] } }; ads: { name: string; creative_id: string; status: string; bid_amount: number; }[] }[];
    spend: any; // Define spend as any
    platform: any; // Define platform as any
    ctr: any; // Define ctr as any
    cpc: any; // Define cpc as any
    cpm: any; // Define cpm as any
    reach: any; // Define reach as any
    frequency: any; // Define frequency as any
    adsets: any[];
}

const CampaignCreation: React.FC = () => {
    const [mode, setMode] = useState<string>('manual');
    const [campaignData, setCampaignData] = useState<Campaign>({
        id: '',
        userId: '',
        mode: 'manual',
        name: 'Campaign ' + Math.floor(Math.random() * 1000), // Random name
        status: 'paused',
        startDate: new Date().toISOString().split('T')[0], // Default to today
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 3 days from now
        budget: '4999', // Define budget as any
        objective: 'OUTCOME_TRAFFIC', // Default objective
        specialAdCategories: [],
        clicks: 0, // Initialize clicks
        impressions: 0, // Initialize impressions
        ads: [
            {
                name: 'Ad Set ' + Math.floor(Math.random() * 1000), // Random name
                content: 'Content ' + Math.floor(Math.random() * 1000), // Random content
                ads: [
                    {
                        name: 'Ad ' + Math.floor(Math.random() * 1000), // Random name
                        creative_id: '1234567890', // Mock creative ID
                        status: 'PAUSED',
                        bid_amount: 100 // Default bid amount
                    }
                ]
            }
        ],
        spend: '0', // Define spend as any
        platform: 'Facebook', // Define platform as any
        ctr: '0', // Define ctr as any
        cpc: 0, // Define cpc as any
        cpm: 0, // Define cpm as any
        reach: 0,
        frequency: 0,
        adsets: []
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [competitorAdId, setCompetitorAdId] = useState<string>('');
    const [uploadedCreativeIds, setUploadedCreativeIds] = useState<string[]>([]);
    const dispatch = useDispatch();
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const [pageId, setPageId] = useState<string>('113761611224912'); // Default page ID
    const [link, setLink] = useState<string>('https://ph2digital.com/'); // Default link
    const [message, setMessage] = useState<string>('Ad message'); // Default message

    useEffect(() => {
        // Fetch default pageId and link if available
        const fetchDefaults = async () => {
            try {
                // Simulate fetching default values from an API or local storage
                const defaultPageId = '113761611224912'; // Replace with actual logic to fetch default pageId
                const defaultLink = 'https://ph2digital.com/'; // Replace with actual logic to fetch default link

                setPageId(defaultPageId);
                setLink(defaultLink);
            } catch (error) {
                console.error('Error fetching default values:', error);
            }
        };

        fetchDefaults();
    }, []);

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
            let response: Campaign;
            const formattedCampaignData = {
                ...campaignData,
                startDate: new Date(campaignData.startDate).toISOString(),
                endDate: new Date(campaignData.endDate).toISOString()
            };
            if (mode === 'guided') {
                response = await mockCreateCampaign({
                    customerId,
                    ...formattedCampaignData,
                    mode: 'guided',
                });
            } else if (mode === 'automatic') {
                response = await mockCreateCampaign({
                    customerId,
                    ...formattedCampaignData,
                    mode: 'automatic',
                });
            } else {
                response = await mockCreateCampaign({
                    customerId,
                    ...formattedCampaignData,
                    mode: 'manual',
                });
            }
            dispatch(createCampaignAction(response));
            console.log('Campaign created successfully:', response);

            // Create ad sets and ads
            for (const adSet of campaignData.ads) {
                const adSetResponse = await mockCreateAdSet({
                    customerId,
                    campaignId: response.id,
                    name: adSet.name,
                    budget: campaignData.budget,
                    startDate: campaignData.startDate,
                    endDate: campaignData.endDate,
                    targeting: adSet.targeting || { geo_locations: { countries: ['US'] } },
                    ads: [],
                });
                console.log('Ad set created successfully:', adSetResponse);

                for (const ad of adSet.ads) {
                    let creativeId = ad.creative_id;
                    if (uploadedCreativeIds.length > 0) {
                        creativeId = uploadedCreativeIds.shift() || creativeId;
                    }

                    const adResponse = await mockCreateAd({
                        customerId,
                        adSetId: adSetResponse.id,
                        name: ad.name,
                        creative_id: creativeId,
                        status: ad.status,
                        bid_amount: ad.bid_amount,
                    });
                    console.log('Ad created successfully:', adResponse);
                }
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            setError('Erro ao criar campanha. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.warn('Nenhum arquivo selecionado para upload.');
            setError('Por favor, selecione pelo menos um arquivo.');
            return;
        }

        const files = Array.from(e.target.files);

        if (!accessToken) {
            console.error('Access token está ausente.');
            setError('Erro de autenticação. Token de acesso está ausente.');
            return;
        }

        // Certifique-se de que o `customerId` está definido
        if (!customerId) {
            console.error('Customer ID is missing.');
            setError('Customer ID is missing.');
            return;
        }

        // Validações adicionais
        if (!pageId || !link || !message) {
            console.error('PAGE_ID, link ou message estão ausentes.');
            setError('PAGE_ID, link e message são obrigatórios.');
            return;
        }

        try {
            console.info(`Iniciando upload de ${files.length} arquivos para o cliente ${customerId}...`);
            const uploadResponse: { success: boolean; image_hash?: string } = await uploadCreativeFiles(accessToken, customerId, files, pageId, link, message);
            console.log('Upload realizado com sucesso:', uploadResponse);

            // Armazene o image_hash retornado
            if (uploadResponse.success && uploadResponse.image_hash) {
                setUploadedCreativeIds([uploadResponse.image_hash]);
            } else {
                setError('Upload response does not contain image_hash.');
            }
        } catch (error) {
            console.error('Erro ao fazer upload dos arquivos:', error);
            setError('Erro ao fazer upload dos arquivos. Por favor, tente novamente.');
        }
    };

    const handleRequestCreative = async (competitorAdId: string) => {
        try {
            if (accessToken) {
                const response = await requestCreativeBasedOnCompetitor(accessToken, competitorAdId);
                console.log('Creative requested successfully:', response);
            } else {
                setError('Access token is missing.');
                return;
            }
        } catch (error) {
            console.error('Error requesting creative:', error);
            setError('Erro ao solicitar criativo. Por favor, tente novamente.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            ads: [...prevState.ads, { name: '', content: '', ads: [] }]
        }));
    };

    const handleAdChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                <button onClick={() => setMode('guided')}>Guiado</button>
                <button onClick={() => setMode('manual')}>Manual</button>
                <button onClick={() => setMode('automatic')}>Automático</button>
            </div>
            <CampaignForm
                campaignData={campaignData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleAddAd={handleAddAd}
                handleAdChange={handleAdChange}
            />
            <TargetAudienceSelector />
            <BudgetCalculator />
            <div className="upload-section">
                <h3>Upload de Arquivos</h3>
                <label>ID da Página do Facebook:</label>
                <input type="text" value={pageId} onChange={(e) => setPageId(e.target.value)} required />
                <label>Link:</label>
                <input type="text" value={link} onChange={(e) => setLink(e.target.value)} required />
                <label>Mensagem:</label>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} required />
                <input type="file" multiple onChange={handleUploadFiles} />
                </div>
            <div className="request-section">
                <h3>Solicitação com Base em Anúncios de Concorrentes</h3>
                <input type="text" placeholder="ID do Anúncio do Concorrente" onChange={(e) => setCompetitorAdId(e.target.value)} />
                <button className="request-button" onClick={() => handleRequestCreative(competitorAdId)}>Solicitar Criativo</button>
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
