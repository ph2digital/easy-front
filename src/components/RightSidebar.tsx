import React, { useState, useEffect } from 'react';
import './styles/RightSidebar.css';
import { getGPTResponse, getSessionFromLocalStorage, submitComment, fetchThreads, createThread, fetchMessages } from '../services/api';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState<number | null>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);

  useEffect(() => {
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    if (userId) {
      fetchThreadsForUser(userId);
    }
  }, []);

  useEffect(() => {
    if (activeThread) {
      fetchMessagesForThread(activeThread);
    }
  }, [activeThread]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isOpen && activeThread) {
      intervalId = setInterval(() => {
        fetchMessagesForThread(activeThread);
      }, 10000); // Fetch messages every 10 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOpen, activeThread]);

  const fetchThreadsForUser = async (userId: string) => {
    try {
      const response = await fetchThreads(userId);
      if (response.length === 0) {
        const newThread = await createThread(userId);
        setThreads([newThread]);
        setActiveThread(newThread.id);
        localStorage.setItem('threads', JSON.stringify([newThread]));
        localStorage.setItem('activeThread', newThread.id);
      } else {
        setThreads(response);
        setActiveThread(response[0].id);
        localStorage.setItem('threads', JSON.stringify(response));
        localStorage.setItem('activeThread', response[0].id);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const fetchMessagesForThread = async (threadId: string) => {
    try {
      const response = await fetchMessages(threadId);
      const formattedMessages = response.data.map((msg: any) => ({
        role: msg.role,
        content: msg.content.map((c: any) => c.text.value).join(' ')
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (text.trim()) {
      setMessages([...messages, { role: 'user', content: text }]);
      const userMessage = text;
      setText('');
      try {
        const session = getSessionFromLocalStorage();
        const userId = session?.user?.id;
        await getGPTResponse(userMessage, userId, activeThread);
        // const formattedResponse = response.replace(/\n/g, '<br/>');
        // setMessages((prevMessages) => [...prevMessages, { role: 'copilot', content: formattedResponse }]);
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

  const handleAddComment = (index: number) => {
    setShowCommentInput(index);
  };

  const handleCommentSubmit = async (index: number) => {
    if (comment.trim()) {
      try {
        const session = getSessionFromLocalStorage();
        const userId = session?.user?.id;
        await submitComment(userId, index, comment);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index].content += `<br/><strong>Comment:</strong> ${comment}`;
          return newMessages;
        });
        setComment('');
        setShowCommentInput(null);
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  const handleThreadClick = (threadId: string) => {
    setActiveThread(threadId);
    localStorage.setItem('activeThread', threadId);
  };

  return (
    <div className={`right-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Copilot</h2>
      <div className="sidebar">
        <div className="threads-list">
          {threads.map((thread) => (
            <button
              key={thread.id}
              className={`thread-button ${thread.id === activeThread ? 'active' : ''}`}
              onClick={() => handleThreadClick(thread.id)}
            >
              {thread.title || `Thread ${thread.id}`}
            </button>
          ))}
        </div>
        <div className="content">
          {messages.map((msg, index) => (
            <div key={index} className={`message-box ${msg.role}`}>
              <p dangerouslySetInnerHTML={{ __html: msg.content }}></p>
              <button className="comment-button" onClick={() => handleAddComment(index)}>Add Comment</button>
              {showCommentInput === index && (
                <div className="comment-input-container">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type a comment"
                  />
                  <button onClick={() => handleCommentSubmit(index)}>Submit</button>
                </div>
              )}
            </div>
          ))}
        </div>
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