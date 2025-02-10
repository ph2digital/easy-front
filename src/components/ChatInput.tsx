import React, { useState } from 'react';
import './styles/ChatInput.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="input-container">
      <div className="input-box">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Envie uma mensagem"
        />
      </div>
      <button 
        className="send-button" 
        onClick={handleSendMessage}
        title="Enviar mensagem"
      >
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  );
};

export default ChatInput;
