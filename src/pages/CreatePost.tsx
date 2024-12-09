
import React, { useState } from 'react';
import './styles/CreatePost.css';

const CreatePost: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePublish = () => {
    console.log('Publish post:', postContent);
    setSuccessMessage('Post has been successfully published.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  const handleSchedule = () => {
    console.log('Schedule post:', postContent);
    setSuccessMessage('Post has been successfully scheduled.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  return (
    <div className="create-post" id="create-post-page">
      <h1 className="create-post-title">Criar Postagem</h1>
      <textarea
        className="post-content"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Escreva seu post aqui..."
      />
      <div className="post-actions">
        <button className="publish-button" onClick={handlePublish}>Publicar</button>
        <button className="schedule-button" onClick={handleSchedule}>Agendar</button>
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default CreatePost;