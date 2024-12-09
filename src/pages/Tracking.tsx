import React from 'react';
import './styles/Tracking.css';

const ConversionChart: React.FC = () => {
  return (
    <div className="conversion-chart">
      <h2>Conversion Chart</h2>
      {/* Add chart implementation here */}
    </div>
  );
};

const TrackingSummary: React.FC = () => {
  return (
    <div className="tracking-summary">
      <h2>Tracking Summary</h2>
      {/* Add summary implementation here */}
    </div>
  );
};

const Tracking: React.FC = () => {
  const mockTrackingData = [
    { id: '1', name: 'Tracking Item 1', status: 'Active' },
    { id: '2', name: 'Tracking Item 2', status: 'Inactive' },
    { id: '3', name: 'Tracking Item 3', status: 'Pending' },
    { id: '4', name: 'Tracking Item 4', status: 'Completed' },
    { id: '5', name: 'Tracking Item 5', status: 'Delayed' },
    { id: '6', name: 'Tracking Item 6', status: 'Cancelled' },
  ];

  return (
    <div className="tracking">
      <h1>Tracking</h1>
      <TrackingSummary />
      <ConversionChart />
      <ul>
        {mockTrackingData.map((item) => (
          <li key={item.id} className={`tracking-item ${item.status.toLowerCase()}`}>
            {item.name} - {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tracking;
