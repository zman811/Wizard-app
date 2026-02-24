import React, { useState } from 'react';
import { Wizard, Task, Goal } from '../types';
import { getGoalsForWizard, getCompletedTaskCount } from '../gameLogic';

interface GoalsListProps {
  wizard: Wizard;
  tasks: Task[];
  onClaimGoal: (goalId: string) => void;
  onAddGoal: (name: string, description: string, rewards: { experience: number; mana?: number; mind?: number; }) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ wizard, tasks, onClaimGoal, onAddGoal, onDeleteGoal }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', description: '', experience: 100, mana: 0, mind: 0 });

  const allGoals = getGoalsForWizard(wizard, tasks);
  const completedCount = getCompletedTaskCount(tasks);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name.trim()) return;
    // Custom goals are manual — user types what it's for; no targetNumber
    onAddGoal(newGoal.name.trim(), newGoal.description.trim(), { experience: newGoal.experience, mana: newGoal.mana || undefined, mind: newGoal.mind || undefined });
    setNewGoal({ name: '', description: '', experience: 100, mana: 0, mind: 0 });
    setShowAddForm(false);
  };

  return (
    <div className="goals-section">
      <div className="goals-header">
        <h3>Goals</h3>
        <button className="add-task-btn" onClick={() => setShowAddForm(s => !s)}>{showAddForm ? 'Cancel' : '+ Add Goal'}</button>
      </div>

      {showAddForm && (
        <form className="add-goal-form" onSubmit={handleAddSubmit}>
          <input type="text" placeholder="Goal name" value={newGoal.name} onChange={e => setNewGoal({ ...newGoal, name: e.target.value })} required />
          <textarea placeholder="What is this goal for?" value={newGoal.description} onChange={e => setNewGoal({ ...newGoal, description: e.target.value })} />
          <div className="form-row">
            <label>Experience Reward:</label>
            <input type="number" min={0} value={newGoal.experience} onChange={e => setNewGoal({ ...newGoal, experience: parseInt(e.target.value) || 0 })} />
            <label>Mana:</label>
            <input type="number" min={0} value={newGoal.mana} onChange={e => setNewGoal({ ...newGoal, mana: parseInt(e.target.value) || 0 })} />
            <label>Mind:</label>
            <input type="number" min={0} value={newGoal.mind} onChange={e => setNewGoal({ ...newGoal, mind: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Create Goal</button>
          </div>
        </form>
      )}

      <div className="goals-list">
        {allGoals.map(goal => {
          if (goal.type === 'totalTasks') {
            const progress = completedCount;
            const target = goal.targetNumber || 1;
            const percent = Math.min(100, Math.floor((progress / target) * 100));
            const ready = progress >= target && !goal.claimed;

            return (
              <div key={goal.id} className="task-item goal-item">
                <div className="task-info">
                  <div className="task-name">{goal.name}</div>
                  <div className="task-description">{goal.description}</div>
                  <div className="goal-meter">
                    <div className="meter-bar" style={{ background: '#444', height: '10px', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, background: '#6b8cff', height: '100%' }} />
                    </div>
                    <div className="meter-text">{progress}/{target}</div>
                  </div>
                  <div className="task-rewards">Rewards: {goal.rewards.experience} XP{goal.rewards.mana ? `, +${goal.rewards.mana} Mana` : ''}{goal.rewards.mind ? `, +${goal.rewards.mind} Mind` : ''}</div>
                </div>
                <div className="task-actions">
                  <button className="task-btn" disabled={!ready} onClick={() => onClaimGoal(goal.id)}>{goal.claimed ? 'Claimed' : 'Claim'}</button>
                </div>
              </div>
            );
          }

          // custom goal — manual claim
          return (
            <div key={goal.id} className="task-item goal-item">
              <div className="task-info">
                <div className="task-name">{goal.name}</div>
                <div className="task-description">{goal.description}</div>
                <div className="task-rewards">Rewards: {goal.rewards.experience} XP{goal.rewards.mana ? `, +${goal.rewards.mana} Mana` : ''}{goal.rewards.mind ? `, +${goal.rewards.mind} Mind` : ''}</div>
              </div>
              <div className="task-actions">
                <button className="task-btn" disabled={!!goal.claimed} onClick={() => onClaimGoal(goal.id)}>{goal.claimed ? 'Claimed' : 'Claim'}</button>
                <div className="task-controls">
                  <button className="delete-btn" onClick={() => onDeleteGoal(goal.id)}>🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsList;
