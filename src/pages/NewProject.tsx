import React from 'react';
import './styles/NewProject.css';

const NewProject: React.FC = () => {
  const mockWorkspaces = [
    { id: '1', name: 'Workspace 1' },
    { id: '2', name: 'Workspace 2' },
    { id: '3', name: 'Workspace 3' },
  ];

  return (
    <div className="new-project">
      <h1>Trocar Workspace</h1>
      <ul>
        {mockWorkspaces.map((workspace) => (
          <li key={workspace.id}>{workspace.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default NewProject;