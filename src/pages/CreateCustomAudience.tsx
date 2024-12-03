import React from 'react';
import './styles/CreateCustomAudience.css';

const CreateCustomAudience: React.FC = () => {
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
  ];

  return (
    <div className="create-custom-audience">
      <h1>Create Custom Audience</h1>
      <ul>
        {mockAudienceData.map((audience) => (
          <li key={audience.id}>
            {audience.name} - {audience.size}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateCustomAudience;
