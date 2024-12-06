import React, { useState } from 'react';
import './styles/RightSidebar.css';
import { getGPTResponse, getSessionFromLocalStorage } from '../services/api'; // Import the new function

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSend = async () => {
    if (text.trim()) {
      setMessages([...messages, { role: 'user', content: text }]);
      const userMessage = text;
      setText('');
      try {
        const session = getSessionFromLocalStorage();
        const userId = session?.user?.id;
        const response = await getGPTResponse(userMessage, userId);
        const formattedResponse = response.replace(/\n/g, '<br/>');
        setMessages((prevMessages) => [...prevMessages, { role: 'copilot', content: formattedResponse }]);
      } catch (error) {
        setMessages((prevMessages) => [...prevMessages, { role: 'copilot', content: 'Erro ao obter resposta do GPT' }]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`right-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Copilot</h2>
      <div className="content">
        {messages.map((msg, index) => (
          <div key={index} className={`message-box ${msg.role}`}>
            <p dangerouslySetInnerHTML={{ __html: msg.content }}></p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default RightSidebar;