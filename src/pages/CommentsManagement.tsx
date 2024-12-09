import React, { useState } from 'react';
import CommentList from '../components/comments/CommentList';
import { MessageSquare } from 'lucide-react';

const mockComments = [
  {
    id: '1',
    user: {
      name: 'João Silva',
      avatar: 'https://i.pravatar.cc/150?u=joao',
    },
    text: 'Produto incrível! Superou minhas expectativas.',
    date: '2024-03-15 14:30',
    likes: 12,
  },
  {
    id: '2',
    user: {
      name: 'Maria Santos',
      avatar: 'https://i.pravatar.cc/150?u=maria',
    },
    text: 'Quanto custa o frete para São Paulo?',
    date: '2024-03-15 15:45',
    likes: 3,
  },
  {
    id: '3',
    user: {
      name: 'Pedro Costa',
      avatar: 'https://i.pravatar.cc/150?u=pedro',
    },
    text: 'Tem disponível na cor azul?',
    date: '2024-03-15 16:20',
    likes: 1,
  },
];

const mockPostCreation = () => {
  console.log('Mock post created');
  alert('Post created successfully!');
};

const CommentsManagement: React.FC = () => {
  const [comments, setComments] = useState(mockComments);

  const handleReply = (commentId: string) => {
    console.log('Reply to comment:', commentId);
  };

  const handleHide = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleDelete = (commentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  return (
    <div className="comments-management p-6 max-w-4xl mx-auto" id="comments-management-page">
      <div className="comments-header flex items-center gap-3 mb-6">
        <MessageSquare className="comments-icon w-6 h-6 text-blue-600" />
        <h1 className="comments-title text-2xl font-bold">Gerenciamento de Comentários</h1>
      </div>
      <div className="comments-summary mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="comments-subtitle text-lg font-semibold">Comentários Recentes</h2>
            <p className="comments-count text-sm text-gray-600">
              {comments.length} comentários necessitam de atenção
            </p>
          </div>
          <select className="comments-filter border border-gray-300 rounded-md px-3 py-1.5">
            <option value="recent">Mais recentes</option>
            <option value="likes">Mais curtidos</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
      </div>
      <button className="create-post-button" onClick={mockPostCreation}>Create New Post</button> {/* Mock post creation */}
      <CommentList
        comments={comments}
        onReply={handleReply}
        onHide={handleHide}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CommentsManagement;