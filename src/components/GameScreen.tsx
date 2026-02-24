import React, { useState } from 'react';
import { Wizard, Task, Spell } from '../types';
import WizardStats from './WizardStats';
import TasksList from './TasksList';
import GoalsList from './GoalsList';
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
  onClaimGoal: (goalId: string) => void;
  onAddGoal: (name: string, description: string, rewards: { experience: number; mana?: number; mind?: number; }) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  wizard,
  tasks,
  spells,
  onCompleteTask,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onClaimGoal,
  onAddGoal,
  onDeleteGoal
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'battlegrounds' | 'goals'>('tasks');

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
            <button className={`tab-button ${activeTab === 'goals' ? 'tab-active' : ''}`} onClick={() => setActiveTab('goals')}>Goals</button>
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
          ) : activeTab === 'goals' ? (
            <GoalsList
              wizard={wizard}
              tasks={tasks}
              onClaimGoal={onClaimGoal}
              onAddGoal={onAddGoal}
              onDeleteGoal={onDeleteGoal}
            />
          ) : (
            <BattleGrounds />
          )}
        </div>
      </div>
    </>
  );
};

export default GameScreen;