import React, { useState, useEffect } from 'react';
import './styles/RightSidebar.css';
import { getGPTResponse, getSessionFromLocalStorage, submitComment, fetchThreads, createThread, fetchMessages, fetchRuns } from '../services/api';
import { setToSessionStorage, getFromSessionStorage } from '../utils/storage';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [runs, setRuns] = useState<any[]>([]);

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
      fetchRunsForThread(activeThread);
    }
  }, [activeThread]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isOpen && activeThread) {
      intervalId = setInterval(() => {
        fetchMessagesForThread(activeThread);
        fetchRunsForThread(activeThread);
      }, 10000); // Fetch messages and runs every 10 seconds
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
        sessionStorage.setItem('threads', JSON.stringify([newThread]));
        sessionStorage.setItem('activeThread', newThread.id);
      } else {
        setThreads(response);
        setActiveThread(response[0].id);
        sessionStorage.setItem('threads', JSON.stringify(response));
        sessionStorage.setItem('activeThread', response[0].id);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const fetchMessagesForThread = async (threadId: string) => {
    try {
      const response = await fetchMessages(threadId);
      const formattedMessages = response.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content.map((c: any) => c.text.value).join(' ')
      }));
      setMessages(formattedMessages);
      setToSessionStorage('messages', formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchRunsForThread = async (threadId: string) => {
    try {
      const response = await fetchRuns(threadId);
      setRuns(Array.isArray(response) ? response : []);
      setToSessionStorage('runs', Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching runs:', error);
    }
  };

  const handleSend = async () => {
    if (text.trim()) {
      const newMessage = { id: `temp-${Date.now()}`, role: 'user', content: text };
      setMessages([...messages, newMessage]);
      setToSessionStorage('messages', [...messages, newMessage]);
      const userMessage = text;
      setText('');
      try {
        const session = getSessionFromLocalStorage();
        const userId = session?.user?.id;
        await getGPTResponse(userMessage, userId, activeThread);
        // const formattedResponse = response.replace(/\n/g, '<br/>');
        // setMessages((prevMessages) => [...prevMessages, { role: 'copilot', content: formattedResponse }]);
      } catch (error) {
        const errorMessage = { id: `temp-${Date.now()}`, role: 'copilot', content: 'Erro ao obter resposta do GPT' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setToSessionStorage('messages', [...messages, errorMessage]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleAddComment = (messageId: string) => {
    setShowCommentInput(messageId);
  };

  const handleCommentSubmit = async (messageId: string) => {
    if (comment.trim()) {
      try {
        const session = getSessionFromLocalStorage();
        const userId = session?.user?.id;
        await submitComment(userId, messageId, comment);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const messageIndex = newMessages.findIndex((msg) => msg.id === messageId);
          if (messageIndex !== -1) {
            newMessages[messageIndex].content += `<br/><strong>Comment:</strong> ${comment}`;
          }
          return newMessages;
        });
        setToSessionStorage('messages', messages);
        setComment('');
        setShowCommentInput(null);
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  const handleThreadClick = (threadId: string) => {
    setActiveThread(threadId);
    sessionStorage.setItem('activeThread', threadId);
  };

  const handleCreateThread = async () => {
    try {
      const session = getSessionFromLocalStorage();
      const userId = session?.user?.id;
      if (userId) {
        const newThread = await createThread(userId);
        setThreads((prevThreads) => [...prevThreads, newThread]);
        setActiveThread(newThread.id);
        sessionStorage.setItem('threads', JSON.stringify([...threads, newThread]));
        sessionStorage.setItem('activeThread', newThread.id);
      }
    } catch (error) {
      console.error('Error creating new thread:', error);
    }
  };

  useEffect(() => {
    const loadMessagesFromSession = () => {
      const storedMessages = getFromSessionStorage('messages');
      setMessages(storedMessages || []);
    };

    const loadRunsFromSession = () => {
      const storedRuns = getFromSessionStorage('runs');
      setRuns(storedRuns || []);
    };

    loadMessagesFromSession();
    loadRunsFromSession();
  }, []);

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
          <button className="new-thread-button" onClick={handleCreateThread}>New Thread</button>
        </div>
        <div className="content">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-box ${msg.role}`}>
              <p dangerouslySetInnerHTML={{ __html: msg.content }}></p>
              <button className="comment-button" onClick={() => handleAddComment(msg.id)}>Add Comment</button>
              {showCommentInput === msg.id && (
                <div className="comment-input-container">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type a comment"
                  />
                  <button onClick={() => handleCommentSubmit(msg.id)}>Submit</button>
                </div>
              )}
            </div>
          ))}
          <div className="runs-list">
            {runs.map((run: any) => (
              <div key={run.id} className="run-box">
                <p><strong>Run ID:</strong> {run.id}</p>
                <p><strong>Status:</strong> {run.status}</p>
                <p><strong>Created At:</strong> {new Date(run.created_at * 1000).toLocaleString()}</p>
              </div>
            ))}
          </div>
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