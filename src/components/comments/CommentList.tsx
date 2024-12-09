import React from 'react';
import { MessageSquare, ThumbsUp, Trash2, EyeOff, Reply } from 'lucide-react';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  date: string;
  likes: number;
}

interface CommentListProps {
  comments: Comment[];
  onReply: (commentId: string) => void;
  onHide: (commentId: string) => void;
  onDelete: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onReply, onHide, onDelete }) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-start gap-3">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{comment.user.name}</h4>
                <span className="text-sm text-gray-500">{comment.date}</span>
              </div>
              <p className="mt-1 text-gray-700">{comment.text}</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {comment.likes}
                </div>
                <button
                  onClick={() => onReply(comment.id)}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700"
                >
                  <Reply className="w-4 h-4 mr-1" />
                  Responder
                </button>
                <button
                  onClick={() => onHide(comment.id)}
                  className="flex items-center text-gray-600 text-sm hover:text-gray-700"
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  Ocultar
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="flex items-center text-red-600 text-sm hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;