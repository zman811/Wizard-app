import React, { useState } from 'react';

interface CharacterCreationProps {
  onCreateWizard: (name: string) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCreateWizard }) => {
  const [wizardName, setWizardName] = useState('');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wizardName.trim()) {
      onCreateWizard(wizardName.trim());
    }
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="screen character-creation">
      <h2>Create Your Wizard</h2>
      <div className="wizard-preview">
        <div className="wizard-avatar">🧙‍♂️</div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={wizardName}
          onChange={(e) => setWizardName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your wizard name"
          maxLength={20}
          autoFocus
        />
        <button type="submit" disabled={!wizardName.trim()}>
          Begin Your Training!
        </button>
      </form>
    </div>
  );
};

export default CharacterCreation;