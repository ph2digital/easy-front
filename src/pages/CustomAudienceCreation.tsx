import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addCustomer } from '../store/selectedCustomersSlice';
import { fetchCustomAudiences, createCustomAudience, getSessionFromLocalStorage } from '../services/api';
import './styles/CustomAudienceCreation.css';

const renderCustomAudiences = (data) => {
  return data.map((audience: any) => (
    <li key={audience.id} className="custom-audience-item" id={`custom-audience-item-${audience.id}`}>
      <p><strong>ID:</strong> {audience.id}</p>
      <p><strong>Nome:</strong> {audience.name}</p>
      <p><strong>Tipo:</strong> {audience.subtype}</p>
      <p><strong>Descrição:</strong> {audience.description}</p>
      <p><strong>Status da Operação:</strong> {audience.operation_status.description}</p>
      <p><strong>Criado em:</strong> {new Date(audience.time_created * 1000).toLocaleString()}</p>
      <p><strong>Atualizado em:</strong> {new Date(audience.time_updated * 1000).toLocaleString()}</p>
    </li>
  ));
};

const CustomAudienceCreation: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [subtype, setSubtype] = useState('CUSTOM');
  const [rule, setRule] = useState('');
  const [lookalikeSpec, setLookalikeSpec] = useState('');
  const [customerFileSource, setCustomerFileSource] = useState('');
  const [customAudiences, setCustomAudiences] = useState<any[]>([]);
  const dispatch = useDispatch();
  const session = getSessionFromLocalStorage();
  const access_token = session?.access_token || '';
  const storedActiveCustomers = JSON.parse(localStorage.getItem('activeCustomers') || '[]');
  const customerId = storedActiveCustomers?.[0]?.customer_id;
  console.log(`customer_id: ${customerId}`);

  useEffect(() => {
    const fetchAudiences = async () => {
      if (access_token && customerId) {
        try {
          console.log('Fetching custom audiences with access_token:', access_token, 'and adAccountuser.id:', customerId);
          const audiences = await fetchCustomAudiences(access_token, customerId);
          console.log('Fetched custom audiences:', audiences);
          setCustomAudiences(audiences);
        } catch (error) {
          console.error('Error fetching custom audiences:', error);
        }
      } else {
        console.warn('Access token or adAccountuser.id is missing:', { access_token, meta_id: customerId });
      }
    };

    fetchAudiences();
  }, [customerId, access_token]);

  const handleAddCustomer = async () => {
    if (customerName.trim() && access_token && customerId) {
      try {
        const audienceData: any = {
          name: customerName,
          description,
          subtype,
        };

        if (subtype === 'ENGAGEMENT') {
          const ruleObj = JSON.parse(rule);
          if (!/^[a-zA-Z0-9_]{1,50}$/.test(ruleObj.event)) {
            console.error('Invalid event name for ENGAGEMENT subtype');
            return;
          }
          audienceData.rule = rule;
        } else if (subtype === 'LOOKALIKE') {
          audienceData.lookalike_spec = JSON.stringify(lookalikeSpec);
        } else if (subtype === 'CUSTOM') {
          if (!customerFileSource) {
            console.error('Missing parameter: customer_file_source');
            return;
          }
          audienceData.customer_file_source = customerFileSource;
        }

        console.log('Creating custom audience with data:', audienceData);
        const newAudience = await createCustomAudience(customerId, audienceData, access_token);
        console.log('Created custom audience:', newAudience);
        dispatch(addCustomer(newAudience[0].name));
        setCustomerName('');
        setDescription('');
        setRule('');
        setLookalikeSpec('');
        setCustomerFileSource('');
        setCustomAudiences([...customAudiences, newAudience[0]]);
      } catch (error) {
        console.error('Error creating custom audience:', error);
      }
    } else {
      console.warn('Missing required fields:', { customerName, access_token, customerId });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with customerName:', customerName, 'description:', description, 'subtype:', subtype);
    handleAddCustomer();
  };

  return (
    <div className="custom-audience-creation" id="custom-audience-creation-page">
      <h1 className="custom-audience-creation-title">Criar Público Personalizado</h1>
      <form onSubmit={handleSubmit} className="custom-audience-form">
        <label htmlFor="customerName">Nome do Cliente:</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nome do Cliente"
          required
        />
        <label htmlFor="description">Descrição:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição"
          required
        />
        <label htmlFor="subtype">Tipo:</label>
        <select id="subtype" value={subtype} onChange={(e) => setSubtype(e.target.value)} required>
          <option value="CUSTOM">Custom</option>
          <option value="LOOKALIKE">Lookalike</option>
          <option value="ENGAGEMENT">Engagement</option>
        </select>
        {subtype === 'ENGAGEMENT' && (
          <>
            <label htmlFor="rule">Regra:</label>
            <textarea
              id="rule"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              placeholder="Regra"
              required
            />
          </>
        )}
        {subtype === 'LOOKALIKE' && (
          <>
            <label htmlFor="lookalikeSpec">Especificação de Lookalike:</label>
            <textarea
              id="lookalikeSpec"
              value={lookalikeSpec}
              onChange={(e) => setLookalikeSpec(e.target.value)}
              placeholder="Especificação de Lookalike"
              required
            />
          </>
        )}
        {subtype === 'CUSTOM' && (
          <>
            <label htmlFor="customerFileSource">Fonte do Arquivo do Cliente:</label>
            <input
              type="text"
              id="customerFileSource"
              value={customerFileSource}
              onChange={(e) => setCustomerFileSource(e.target.value)}
              placeholder="Fonte do Arquivo do Cliente"
              required
            />
          </>
        )}
        <button type="submit">Adicionar Cliente</button>
      </form>
      <h2 className="existing-audiences-title">Publicos Existentes</h2>
      <div className="custom-audience-filters">
        <select className="custom-audience-filter">
          <option value="all">All</option>
          <option value="custom">Custom</option>
          <option value="lookalike">Lookalike</option>
          <option value="engagement">Engagement</option>
        </select>
      </div>
      <ul className="custom-audience-list">
        {renderCustomAudiences(customAudiences)}
      </ul>
    </div>
  );
};

export default CustomAudienceCreation;
