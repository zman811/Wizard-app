import React from 'react';
import { Spell } from '../types';

interface SpellsListProps {
  spells: Spell[];
  unlockedSpells: string[];
}

const SpellsList: React.FC<SpellsListProps> = ({ spells, unlockedSpells }) => {
  return (
    <div className="spells-section">
      <h3>Spell Collection</h3>
      <div className="spells-list">
        {spells.map(spell => {
          const isUnlocked = unlockedSpells.includes(spell.id);

          return (
            <div key={spell.id} className={`spell-item ${isUnlocked ? '' : 'spell-locked'}`}>
              <div className="spell-icon">{spell.icon}</div>
              <div className="spell-name">
                {spell.name}
                {!isUnlocked && ' 🔒'}
              </div>
              <div className="spell-description">{spell.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpellsList;