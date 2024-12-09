
import React from 'react';

interface IntegrationStatusProps {
  onFetchUserPages: () => void;
  onCreatePost: () => void;
}

const IntegrationStatus: React.FC<IntegrationStatusProps> = ({ onFetchUserPages, onCreatePost }) => {
  return (
    <div>
      <button onClick={onFetchUserPages}>Fetch User Pages</button>
      <button onClick={onCreatePost}>Create New Post</button>
    </div>
  );
};

export default IntegrationStatus;