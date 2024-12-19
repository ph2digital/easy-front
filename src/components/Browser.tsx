import React, { useState } from 'react';
import './styles/Browser.css';

interface BrowserProps {
  initialUrl: string;
}

const Browser: React.FC<BrowserProps> = ({ initialUrl }) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  const handleNavigate = () => {
    setUrl(inputUrl);
  };

  return (
    <div className="browser-container">
      <div className="browser-header">
        <input
          type="text"
          value={inputUrl}
          onChange={handleUrlChange}
          placeholder="Enter URL"
          className="browser-url-input"
        />
        <button onClick={handleNavigate} className="browser-navigate-button">
          Go
        </button>
      </div>
      <div className="webview-container">
        <iframe src={url} title="Browser" />
      </div>
    </div>
  );
};

export default Browser;
