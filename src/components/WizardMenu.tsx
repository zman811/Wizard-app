import React, { useState } from 'react';

interface WizardMenuProps {
  currentWizardName: string;
  wizardNames: string[];
  onSwitchWizard: (name: string) => void;
  onNewWizard: () => void;
  onClearWizard: (name: string) => void;
}

const WizardMenu: React.FC<WizardMenuProps> = ({
  currentWizardName,
  wizardNames,
  onSwitchWizard,
  onNewWizard,
  onClearWizard
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="wizard-menu">
      <button
        className="wizard-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Wizard Menu"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="wizard-menu-dropdown">
          <div className="menu-header">
            Current: <strong>{currentWizardName}</strong>
          </div>

          <div className="menu-divider"></div>

          <div className="menu-section">
            <p className="menu-label">Switch Wizard</p>
            {wizardNames.length > 0 ? (
              <div className="wizard-list">
                {wizardNames.map(name => (
                  <button
                    key={name}
                    className={`wizard-item ${name === currentWizardName ? 'active' : ''}`}
                    onClick={() => {
                      onSwitchWizard(name);
                      setIsOpen(false);
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-wizards">No wizards saved</p>
            )}
          </div>

          <div className="menu-divider"></div>

          <button
            className="menu-btn new-wizard-btn"
            onClick={() => {
              onNewWizard();
              setIsOpen(false);
            }}
          >
            ✨ New Wizard
          </button>

          <div className="menu-divider"></div>

          {wizardNames.includes(currentWizardName) && (
            <button
              className="menu-btn clear-wizard-btn"
              onClick={() => {
                if (window.confirm(`Clear all data for ${currentWizardName}?`)) {
                  onClearWizard(currentWizardName);
                  setIsOpen(false);
                }
              }}
            >
              🗑️ Clear Current Wizard
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WizardMenu;
