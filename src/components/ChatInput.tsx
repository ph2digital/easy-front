import React, { useState } from 'react';
import './styles/ChatInput.css';

interface ChatInputProps {
  onSendMessage: (message: string, thread: string) => Promise<void>;
  thread?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, thread }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && thread) {
      onSendMessage(message, thread);
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
          placeholder={thread ? "Envie uma mensagem" : "Selecione uma conversa para enviar mensagens"}
          disabled={!thread}
        />
      </div>
      <button 
        className="send-button" 
        onClick={handleSendMessage}
        title="Enviar mensagem"
        disabled={!thread}
      >
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  );
};

export default ChatInput;
