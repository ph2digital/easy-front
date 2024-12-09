import React, { useEffect, useState } from 'react';
import styles from './styles/PrivacyPolicy.module.css';

const PrivacyPolicy: React.FC = () => {
  const [policyText, setPolicyText] = useState('');

  useEffect(() => {
    // Fetch policy text from CMS or JSON file
    fetch('/path/to/privacy-policy.json')
      .then(response => response.json())
      .then(data => setPolicyText(data.text))
      .catch(error => console.error('Error fetching privacy policy:', error));
  }, []);

  return (
    <div className={styles.container}>
      <h1>Política de Privacidade</h1>
      <div dangerouslySetInnerHTML={{ __html: policyText }} />
    </div>
  );
};

export default PrivacyPolicy;
