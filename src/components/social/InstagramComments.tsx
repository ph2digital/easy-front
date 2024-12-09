import React, { useEffect, useState } from 'react';
import { metaAdsService } from '../../services/metaAdsService';
import { Input } from '../ui/Input/Input';
import { Button } from '../ui/Button/Button';

interface InstagramCommentsProps {
  accessToken: string;
  instagramAccountId: string;
}

interface Comment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  replies?: Comment[];
}

export const InstagramComments: React.FC<InstagramCommentsProps> = ({
  accessToken,
  instagramAccountId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [selectedComment, setSelectedComment] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await metaAdsService.getInstagramComments(
          accessToken,
          instagramAccountId
        );
        setComments(data);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [accessToken, instagramAccountId]);

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      await metaAdsService.replyToComment(accessToken, commentId, replyText);
      setReplyText('');
      setSelectedComment(null);
      // Refresh comments
      const data = await metaAdsService.getInstagramComments(
        accessToken,
        instagramAccountId
      );
      setComments(data);
    } catch (err) {
      setError('Failed to post reply');
    }
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{comment.username}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-gray-700">{comment.text}</p>
              
              {selectedComment === comment.id ? (
                <div className="mt-2 space-y-2">
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyText.trim()}
                    >
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedComment(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="mt-2"
                  onClick={() => setSelectedComment(comment.id)}
                >
                  Reply
                </Button>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="bg-gray-50 p-2 rounded border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{reply.username}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};