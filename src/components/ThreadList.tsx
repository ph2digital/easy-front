import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ThreadList.css';

interface Thread {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ThreadListProps {
  onSelectThread: (threadId: string) => void;
  selectedThreadId: string | null;
}

const ThreadList: React.FC<ThreadListProps> = ({ onSelectThread, selectedThreadId }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/threads');
        setThreads(response.data.threads || []);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  if (loading) {
    return <div className="thread-list-loading">Carregando...</div>;
  }

  return (
    <div className="thread-list">
      <h2 className="thread-list-title">Conversas</h2>
      <div className="thread-list-content">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={`thread-item ${selectedThreadId === thread.id ? 'selected' : ''}`}
            onClick={() => onSelectThread(thread.id)}
          >
            <div className="thread-item-title">{thread.title || 'Nova Conversa'}</div>
            <div className="thread-item-date">{formatDate(thread.created_at)}</div>
          </div>
        ))}
        {threads.length === 0 && (
          <div className="thread-list-empty">
            Nenhuma conversa encontrada
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadList;
