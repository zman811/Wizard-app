import React, { useState, useEffect } from 'react';
import { Wizard, Task, Spell } from '../types';
import { setupSpells, setupTasks, createWizard, completeTask, saveGameData, loadGameData, isTaskOnCooldown, addCustomTask, deleteTask, isTaskTimerComplete, getWizardNames, switchWizard, clearWizardData, clearAllGameData, addCustomGoalToWizard, claimGoal, deleteGoalFromWizard } from '../gameLogic';
import CharacterCreation from './CharacterCreation';
import GameScreen from './GameScreen';
import WizardMenu from './WizardMenu';
import './App.css';

const App: React.FC = () => {
  // Initialize game state
  const [wizard, setWizard] = useState<Wizard | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [spells] = useState<Spell[]>(setupSpells());
  const [currentScreen, setCurrentScreen] = useState<'character-creation' | 'main-game'>('character-creation');
  const [wizardNames, setWizardNames] = useState<string[]>([]);

  // Load game data on component mount
  useEffect(() => {
    const { wizard: loadedWizard, tasks: loadedTasks } = loadGameData();
    setWizard(loadedWizard);
    setTasks(loadedTasks);
    setWizardNames(getWizardNames());

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

  // Check for completed timers every second and auto-complete tasks
  useEffect(() => {
    const timerCheckInterval = setInterval(() => {
      setTasks(prevTasks => {
        setWizard(prevWizard => {
          if (!prevWizard) return prevWizard;

          let wizardUpdated = prevWizard;
          const newTasks = prevTasks.map(task => {
            if (task.timerActive && isTaskTimerComplete(task)) {
              // Auto-complete task when timer finishes
              const { wizard: updatedWizard, tasks: updatedTasks } = completeTask(
                wizardUpdated,
                task,
                prevTasks
              );
              wizardUpdated = updatedWizard;
              // Find the completed task and disable timer
              const completedTask = updatedTasks.find(t => t.id === task.id);
              if (completedTask) {
                return { ...completedTask, timerActive: false };
              }
              return task;
            }
            return task;
          });

          setTasks(newTasks);
          return wizardUpdated;
        });
        return prevTasks;
      });
    }, 500); // Check every 500ms

    return () => clearInterval(timerCheckInterval);
  }, []);

  // Handle wizard creation
  const handleCreateWizard = (name: string) => {
    const newWizard = createWizard(name);
    setWizard(newWizard);
    setTasks(setupTasks());
    setWizardNames([...wizardNames, name]);
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
    cooldownHours: number = 24,
    hasTimer: boolean = false,
    timerDurationMinutes: number = 0
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
      cooldownHours,
      hasTimer,
      timerDurationMinutes
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

  // Handle switching to a different wizard
  const handleSwitchWizard = (wizardName: string) => {
    const { wizard: loadedWizard, tasks: loadedTasks } = switchWizard(wizardName);
    setWizard(loadedWizard);
    setTasks(loadedTasks);
    if (loadedWizard) {
      setCurrentScreen('main-game');
    }
  };

  // Goals handlers
  const handleAddGoal = (name: string, description: string, rewards: { experience: number; mana?: number; mind?: number; }) => {
    if (!wizard) return;
    const updatedWizard = addCustomGoalToWizard(wizard, name, description, rewards);
    setWizard(updatedWizard);
  };

  const handleClaimGoal = (goalId: string) => {
    if (!wizard) return;
    const updatedWizard = claimGoal(wizard, goalId, tasks);
    setWizard(updatedWizard);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (!wizard) return;
    const updatedWizard = deleteGoalFromWizard(wizard, goalId);
    setWizard(updatedWizard);
  };

  // Handle creating a new wizard
  const handleNewWizard = () => {
    setCurrentScreen('character-creation');
  };

  // Handle clearing a wizard's data
  const handleClearWizard = (wizardName: string) => {
    clearWizardData(wizardName);
    const newWizardNames = getWizardNames();
    setWizardNames(newWizardNames);

    if (wizard && wizard.name === wizardName) {
      // Cleared current wizard, load first available or go to character creation
      if (newWizardNames.length > 0) {
        const { wizard: loadedWizard, tasks: loadedTasks } = switchWizard(newWizardNames[0]);
        setWizard(loadedWizard);
        setTasks(loadedTasks);
      } else {
        setWizard(null);
        setTasks([]);
        setCurrentScreen('character-creation');
      }
    }
  };

  return (
    <div className="app">
      {currentScreen === 'character-creation' && (
        <CharacterCreation onCreateWizard={handleCreateWizard} />
      )}

      {currentScreen === 'main-game' && wizard && (
        <>
          <WizardMenu
            currentWizardName={wizard.name}
            wizardNames={wizardNames}
            onSwitchWizard={handleSwitchWizard}
            onNewWizard={handleNewWizard}
            onClearWizard={handleClearWizard}
          />
          <GameScreen
            wizard={wizard}
            tasks={tasks}
            spells={spells}
            onCompleteTask={handleCompleteTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onClaimGoal={handleClaimGoal}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        </>
      )}
    </div>
  );
};

export default App;