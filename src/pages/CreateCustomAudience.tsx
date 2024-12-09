import React from 'react';
import './styles/CreateCustomAudience.css';

const mockAudienceData = [
  { id: '1', name: 'Audience 1', size: '1000' },
  { id: '2', name: 'Audience 2', size: '2000' },
  { id: '3', name: 'Audience 3', size: '3000' },
  { id: '4', name: 'Audience 4', size: '4000' },
  { id: '5', name: 'Audience 5', size: '5000' },
  { id: '6', name: 'Audience 6', size: '6000' },
  { id: '7', name: 'Audience 7', size: '7000' },
  { id: '8', name: 'Audience 8', size: '8000' },
  { id: '9', name: 'Audience 9', size: '9000' },
  { id: '10', name: 'Audience 10', size: '10000' },
  { id: '11', name: 'Audience 11', size: '11000' },
  { id: '12', name: 'Audience 12', size: '12000' },
];

interface Audience {
  id: string;
  name: string;
  size: string;
}

const renderAudienceData = (data: Audience[]): JSX.Element[] => {
  return data.map((audience: Audience) => (
    <li key={audience.id} className="audience-item" id={`audience-item-${audience.id}`}>
      {audience.name} - {audience.size}
    </li>
  ));
};

const CreateCustomAudience: React.FC = () => {
  return (
    <div className="create-custom-audience" id="create-custom-audience-page">
      <h1 className="create-custom-audience-title">Create Custom Audience</h1>
      <div className="audience-filters">
        <select className="audience-filter">
          <option value="all">All</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <ul className="audience-list">
        {renderAudienceData(mockAudienceData)}
      </ul>
    </div>
  );
};

export default CreateCustomAudience;
