import React from 'react';
import './styles/ChatHeader.css';

interface ChatHeaderProps {
  onInitChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onInitChat }) => {
  return (
    <div className="chat-header">
      <button className="new-chat" onClick={onInitChat}>
        <i className="fas fa-plus"></i>
        <span>Nova conversa</span>
      </button>
    </div>
  );
};

export default ChatHeader;
