import React, { useState, useEffect } from 'react';
import { Wizard, Task, Spell } from '../types';
import { setupSpells, setupTasks, createWizard, completeTask, saveGameData, loadGameData, isTaskOnCooldown, addCustomTask, deleteTask } from '../gameLogic';
import CharacterCreation from './CharacterCreation';
import GameScreen from './GameScreen';
import './App.css';

const App: React.FC = () => {
  // Initialize game state
  const [wizard, setWizard] = useState<Wizard | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [spells] = useState<Spell[]>(setupSpells());
  const [currentScreen, setCurrentScreen] = useState<'character-creation' | 'main-game'>('character-creation');

  // Load game data on component mount
  useEffect(() => {
    const { wizard: loadedWizard, tasks: loadedTasks } = loadGameData();
    setWizard(loadedWizard);
    setTasks(loadedTasks);

    if (loadedWizard) {
      setCurrentScreen('main-game');
    }
  }, []);

  // Save game data whenever wizard or tasks change
  useEffect(() => {
    if (wizard) {
      saveGameData(wizard, tasks);
    }
  }, [wizard, tasks]);

  // Handle wizard creation
  const handleCreateWizard = (name: string) => {
    const newWizard = createWizard(name);
    setWizard(newWizard);
    setTasks(setupTasks());
    setCurrentScreen('main-game');
  };

  // Handle task completion
  const handleCompleteTask = (task: Task) => {
    if (!wizard || task.completed || isTaskOnCooldown(task)) return;

    const { wizard: updatedWizard, tasks: updatedTasks } = completeTask(wizard, task, tasks);
    setWizard(updatedWizard);
    setTasks(updatedTasks);
  };

  // Handle adding a custom task
  const handleAddTask = (
    name: string,
    description: string,
    duration: number,
    experienceReward: number,
    manaReward?: number,
    mindReward?: number,
    recurrenceType: 'daily' | 'weekly' | 'none' = 'daily',
    icon: string = '📝',
    cooldownHours: number = 24
  ) => {
    const updatedTasks = addCustomTask(
      tasks,
      name,
      description,
      duration,
      experienceReward,
      manaReward,
      mindReward,
      recurrenceType,
      icon,
      cooldownHours
    );
    setTasks(updatedTasks);
  };

  // Handle editing a task
  const handleEditTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = deleteTask(tasks, taskId);
    setTasks(updatedTasks);
  };

  return (
    <div className="app">
      {currentScreen === 'character-creation' && (
        <CharacterCreation onCreateWizard={handleCreateWizard} />
      )}

      {currentScreen === 'main-game' && wizard && (
        <GameScreen
          wizard={wizard}
          tasks={tasks}
          spells={spells}
          onCompleteTask={handleCompleteTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      )}
    </div>
  );
};

export default App;