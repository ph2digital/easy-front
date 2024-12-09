
import React from 'react';

interface ActionButtonsProps {
  onAdsetClick: (adsetId: string) => void;
  onAdClick: () => void;
  onCreateAd: (adSetId: string) => void;
  onEditAdset: (adset: any) => void;
  onEditAd: (ad: any) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAdsetClick,
  onAdClick,
  onCreateAd,
  onEditAdset,
  onEditAd,
}) => {
  return (
    <div>
      <button onClick={() => onAdsetClick('adset1')}>View Adset</button>
      <button onClick={onAdClick}>View Ad</button>
      <button onClick={() => onCreateAd('adset1')}>Create Ad</button>
      <button onClick={() => onEditAdset({ id: 'adset1' })}>Edit Adset</button>
      <button onClick={() => onEditAd({ id: 'ad1' })}>Edit Ad</button>
    </div>
  );
};

export default ActionButtons;