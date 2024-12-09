import React, { useState } from 'react';
import { Calendar, Image, Video, Clock, Send } from 'lucide-react';

interface PostCreatorProps {
  pageId: string;
}

const PostCreator: React.FC<PostCreatorProps> = ({ pageId }) => {
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedMedia(Array.from(event.target.files));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Mock API call
    console.log({
      pageId,
      content,
      media: selectedMedia,
      isScheduled,
      scheduleDate
    });
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Criar Nova Publicação</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que você quer compartilhar?"
            className="w-full p-4 border border-gray-200 rounded-lg min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
            <Image className="w-5 h-5" />
            <span>Imagem</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaSelect}
              className="hidden"
            />
          </label>

          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
            <Video className="w-5 h-5" />
            <span>Vídeo</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleMediaSelect}
              className="hidden"
            />
          </label>
        </div>

        {selectedMedia.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {selectedMedia.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setSelectedMedia(selectedMedia.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
              className="rounded text-blue-600"
            />
            <Clock className="w-5 h-5" />
            <span>Agendar publicação</span>
          </label>

          {isScheduled && (
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-2"
            />
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handlePreview}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            {showPreview ? 'Editar' : 'Pré-visualizar'}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            {isScheduled ? 'Agendar' : 'Publicar'}
          </button>
        </div>
      </form>
      {showPreview && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Pré-visualização</h3>
          <p>{content}</p>
          {selectedMedia.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {selectedMedia.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCreator;