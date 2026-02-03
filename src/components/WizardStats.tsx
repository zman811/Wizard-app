import React from 'react';
import { Wizard } from '../types';

interface WizardStatsProps {
  wizard: Wizard;
}

const WizardStats: React.FC<WizardStatsProps> = ({ wizard }) => {
  return (
    <div className="wizard-info">
      <h2>{wizard.name}</h2>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Level:</span>
          <span>{wizard.level}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Mana:</span>
          <span>{wizard.mana}/{wizard.maxMana}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Mind:</span>
          <span>{wizard.mind}/{wizard.maxMind}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Experience:</span>
          <span>{wizard.experience}/{wizard.experienceToNext}</span>
        </div>
      </div>
    </div>
  );
};

export default WizardStats;