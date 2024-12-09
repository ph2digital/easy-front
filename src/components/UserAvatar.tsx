
import React from 'react';

const UserAvatar: React.FC = () => {
  return (
    <div className="user-avatar">
      <img src="path/to/avatar.jpg" alt="User Avatar" />
      <div className="dropdown-menu">
        <button>Settings</button>
        <button>Logout</button>
        // ...existing code...
      </div>
    </div>
  );
};

export default UserAvatar;