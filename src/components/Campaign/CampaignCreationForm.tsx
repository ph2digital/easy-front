// src/components/CampaignCreationForm.tsx
import React from 'react';

interface CampaignCreationFormProps {
    mode: 'automatic' | 'guided' | 'manual';
}

const BasicInfoForm: React.FC = () => (
  <div>
    <label>Nome da Campanha:</label>
    <input type="text" placeholder="Digite o nome da campanha" />
  </div>
);

const BudgetForm: React.FC = () => (
  <div>
    <label>Orçamento:</label>
    <input type="number" placeholder="Defina o orçamento" />
  </div>
);

const AudienceForm: React.FC = () => (
  <div>
    <label>Público-Alvo:</label>
    <input type="text" placeholder="Defina o público-alvo" />
  </div>
);

const CampaignCreationForm: React.FC<CampaignCreationFormProps> = ({ mode }) => {
    return (
        <div className="campaign-creation-form">
            <h3>Criação de Campanha - Modo: {mode}</h3>
            {mode === 'automatic' && <p>A IA irá configurar automaticamente a campanha com base em informações fornecidas.</p>}
            {mode === 'guided' && <p>A IA irá guiar você através de perguntas para configurar a campanha.</p>}
            {mode === 'manual' && (
                <form>
                    <BasicInfoForm />
                    <BudgetForm />
                    <AudienceForm />
                    <button type="submit">Criar Campanha</button>
                </form>
            )}
        </div>
    );
};

export default CampaignCreationForm;
