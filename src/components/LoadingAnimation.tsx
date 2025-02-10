import React, { useState, useEffect } from 'react';
import '../pages/styles/LoadingAnimation.css';

// Componente de animação de carregamento
export const LoadingMessage: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Analisando sua pergunta');
  const [dots, setDots] = useState('');
  const loadingTexts = [
    'Analisando sua pergunta',
    'Consultando dados',
    'Só mais um momento',
    'Processando informações',
    'Quase pronto'
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      const currentIndex = loadingTexts.indexOf(loadingText);
      const nextIndex = (currentIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[nextIndex]);
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length < 3) {
          return prev + '.';
        }
        return '';
      });
    }, 500);

    return () => {
      clearInterval(textInterval);
      clearInterval(dotsInterval);
    };
  }, [loadingText]);

  return (
    <div className="loading-message">
      <p>{loadingText}{dots}</p>
    </div>
  );
};

// Componente de digitação animada
export const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let isMounted = true;
    let index = 0;

    const typeText = () => {
      if (isMounted && index < text.length) {
        setDisplayText(prev => prev + text[index]);
        index++;
        setTimeout(typeText, 20); // Velocidade de digitação
      }
    };

    typeText();

    return () => {
      isMounted = false;
    };
  }, [text]);

  return <>{displayText}</>;
};
