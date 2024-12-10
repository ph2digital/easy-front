import React, { useState } from 'react';
import { metaAdsService } from '../../services/metaAdsService';
import { Input } from '../ui/Input/Input';
import { Button } from '../ui/Button/Button';
import { useToast } from '../../hooks/useToast';

interface PagePostSchedulerProps {
  accessToken: string;
  pageId: string;
}

export const PagePostScheduler: React.FC<PagePostSchedulerProps> = ({
  accessToken,
  pageId,
}) => {
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSchedulePost = async () => {
    if (!message.trim() || !scheduledTime) {
      showToast('error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await metaAdsService.schedulePost(
        accessToken,
        pageId,
        message,
        scheduledTime
      );
      showToast('success', 'Post scheduled successfully');
      setMessage('');
      setScheduledTime('');
    } catch (error) {
      showToast('error', 'Failed to schedule post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Schedule Post</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 shadow-sm p-2"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your post message..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Schedule Time
          </label>
          <Input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <Button
          onClick={handleSchedulePost}
          disabled={loading || !message.trim() || !scheduledTime}
          className="w-full"
        >
          {loading ? 'Scheduling...' : 'Schedule Post'}
        </Button>
      </div>
    </div>
  );
};