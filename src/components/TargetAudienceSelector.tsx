import React from 'react';

const TargetAudienceSelector: React.FC = () => {
  return (
    <div className="target-audience-selector">
      <h3>Target Audience Selector</h3>
      <label>Geo Locations:</label>
      <input type="text" placeholder="Enter countries" />
      <label>Age Range:</label>
      <input type="text" placeholder="Enter age range" />
      <label>Interests:</label>
      <input type="text" placeholder="Enter interests" />
    </div>
  );
};

export default TargetAudienceSelector;