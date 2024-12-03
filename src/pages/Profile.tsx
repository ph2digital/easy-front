// src/pages/Profile.tsx
import React, { useState } from 'react';
import './styles/Profile.css';

const mockProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  picture: 'https://via.placeholder.com/150',
  bio: 'Software Engineer with 10 years of experience.',
  location: 'San Francisco, CA',
  phone: '123-456-7890',
  website: 'https://johndoe.com',
  linkedin: 'https://linkedin.com/in/johndoe',
};

const Profile: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [profile, setProfile] = useState(mockProfile);

  const handleEdit = () => {
    if (window.confirm('Are you sure you want to edit your profile?')) {
      console.log('Edit profile');
      setSuccessMessage('Profile has been successfully edited.');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
    }
  };

  const handleManageInfoproducts = () => {
    console.log('Manage infoproducts');
    setSuccessMessage('Infoproducts management opened.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  const handleViewReports = () => {
    console.log('View performance reports');
    setSuccessMessage('Performance reports opened.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  const handleEditDetail = (key: string) => {
    const newValue = prompt(`Enter new ${key}:`);
    if (newValue) {
      setProfile({ ...profile, [key]: newValue });
      setSuccessMessage(`${key.charAt(0).toUpperCase() + key.slice(1)} has been successfully edited.`);
      setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
    }
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      <img src={profile.picture} alt="Profile" className="profile-picture" />
      <p><span>Name:</span> {profile.name} <button onClick={() => handleEditDetail('name')}>Edit</button></p>
      <p><span>Email:</span> {profile.email} <button onClick={() => handleEditDetail('email')}>Edit</button></p>
      <p><span>Bio:</span> {profile.bio} <button onClick={() => handleEditDetail('bio')}>Edit</button></p>
      <p><span>Location:</span> {profile.location} <button onClick={() => handleEditDetail('location')}>Edit</button></p>
      <p><span>Phone:</span> {profile.phone} <button onClick={() => handleEditDetail('phone')}>Edit</button></p>
      <p><span>Website:</span> <a href={profile.website}>{profile.website}</a> <button onClick={() => handleEditDetail('website')}>Edit</button></p>
      <p><span>LinkedIn:</span> <a href={profile.linkedin}>{profile.linkedin}</a> <button onClick={() => handleEditDetail('linkedin')}>Edit</button></p>
      <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
      <button className="manage-infoproducts-button" onClick={handleManageInfoproducts}>Manage Infoproducts</button>
      <button className="view-reports-button" onClick={handleViewReports}>View Performance Reports</button>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Profile;
