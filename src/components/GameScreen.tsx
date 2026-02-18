import React, { useState } from 'react';
import { Wizard, Task, Spell } from '../types';
import WizardStats from './WizardStats';
import TasksList from './TasksList';
import SpellsList from './SpellsList';
import BattleGrounds from './BattleGrounds';

interface GameScreenProps {
  wizard: Wizard;
  tasks: Task[];
  spells: Spell[];
  onCompleteTask: (task: Task) => void;
  onAddTask: (
    name: string,
    description: string,
    duration: number,
    experienceReward: number,
    manaReward?: number,
    mindReward?: number,
    recurrenceType?: 'daily' | 'weekly' | 'none',
    icon?: string,
    cooldownHours?: number,
    hasTimer?: boolean,
    timerDurationMinutes?: number
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask?: (taskId: string, updates: Partial<Task>) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  wizard,
  tasks,
  spells,
  onCompleteTask,
  onAddTask,
  onDeleteTask,
  onEditTask
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'battlegrounds'>('tasks');

  return (
    <>
      <header>
        <h1>🧙‍♂️ Wizard Training Academy</h1>
      </header>

      <div className="screen main-game">
        <div className="game-header">
          <WizardStats wizard={wizard} />
          <div className="tabs">
            <button className={`tab-button ${activeTab === 'tasks' ? 'tab-active' : ''}`} onClick={() => setActiveTab('tasks')}>Tasks</button>
            <button className={`tab-button ${activeTab === 'battlegrounds' ? 'tab-active' : ''}`} onClick={() => setActiveTab('battlegrounds')}>Battle Grounds</button>
          </div>
        </div>

        <div className="game-content">
          {activeTab === 'tasks' ? (
            <>
              <TasksList
                tasks={tasks}
                onCompleteTask={onCompleteTask}
                onAddTask={onAddTask}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
              />
              <SpellsList spells={spells} unlockedSpells={wizard.spells} />
            </>
          ) : (
            <BattleGrounds />
          )}
        </div>
      </div>
    </>
  );
};

export default GameScreen;