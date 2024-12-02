import React, { useState } from 'react';
import './RightSidebar.css';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (text.trim()) {
      setMessages([...messages, `User: ${text}`]);
      setText('');
      // Simulate a response from the Copilot
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, `Copilot: Response to "${text}"`]);
      }, 1000);
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
          <div key={index} className="message-box">
            <p>{msg}</p>
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