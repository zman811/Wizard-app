import { Wizard, Task, Spell } from './types';
import type { Goal } from './types';

// Global game state
let wizard: Wizard | null = null;
let tasks: Task[] = [];
let spells: Spell[] = [];

// Setup available spells
export function setupSpells(): Spell[] {
  return [
    {
      id: 'fireball',
      name: 'Fireball',
      description: 'Launch a ball of fire at your enemies',
      icon: '🔥',
      unlockRequirement: { level: 2 }
    },
    {
      id: 'teleport',
      name: 'Teleport',
      description: 'Instantly move to another location',
      icon: '✨',
      unlockRequirement: { level: 3 }
    },
    {
      id: 'healing',
      name: 'Healing Touch',
      description: 'Restore health to yourself or allies',
      icon: '💚',
      unlockRequirement: { tasksCompleted: 5 }
    },
    {
      id: 'invisibility',
      name: 'Invisibility',
      description: 'Become invisible to enemies',
      icon: '👻',
      unlockRequirement: { specialTask: 'meditation' }
    },
    {
      id: 'lightning',
      name: 'Lightning Bolt',
      description: 'Strike enemies with lightning',
      icon: '⚡',
      unlockRequirement: { level: 5 }
    },
    {
      id: 'summon',
      name: 'Summon Familiar',
      description: 'Call forth a magical companion',
      icon: '🐱',
      unlockRequirement: { tasksCompleted: 10 }
    }
  ];
}

// Setup available tasks
export function setupTasks(): Task[] {
  return [
    {
      id: 'workout',
      name: 'Physical Training',
      description: 'Exercise for 1 hour to build your magical stamina',
      duration: 60,
      rewards: { experience: 25, mana: 5 },
      icon: '💪',
      completed: false,
      cooldownHours: 24,
      isCustom: false,
      recurrenceType: 'daily'
    },
    {
      id: 'study',
      name: 'Study Magic',
      description: 'Read magical texts for 30 minutes',
      duration: 30,
      rewards: { experience: 15, mind: 3 },
      icon: '📚',
      completed: false,
      cooldownHours: 12,
      isCustom: false,
      recurrenceType: 'daily'
    },
    {
      id: 'meditation',
      name: 'Meditate',
      description: 'Clear your mind through meditation for 20 minutes',
      duration: 20,
      rewards: { experience: 20, mind: 5 },
      icon: '🧘',
      completed: false,
      cooldownHours: 8,
      isCustom: false,
      recurrenceType: 'daily'
    },
    {
      id: 'practice',
      name: 'Spell Practice',
      description: 'Practice basic spells for 45 minutes',
      duration: 45,
      rewards: { experience: 30, mana: 3, mind: 2 },
      icon: '🔮',
      completed: false,
      cooldownHours: 16,
      isCustom: false,
      recurrenceType: 'daily'
    },
    {
      id: 'nature',
      name: 'Connect with Nature',
      description: 'Spend time in nature gathering magical energy',
      duration: 90,
      rewards: { experience: 35, mana: 8 },
      icon: '🌿',
      completed: false,
      cooldownHours: 24,
      isCustom: false,
      recurrenceType: 'daily'
    },
    {
      id: 'social',
      name: 'Social Interaction',
      description: 'Interact with fellow wizards and learn from them',
      duration: 60,
      rewards: { experience: 20, mind: 4 },
      icon: '👥',
      completed: false,
      cooldownHours: 18,
      isCustom: false,
      recurrenceType: 'daily'
    }
  ];
}

// Add a custom task to the tasks list
export function addCustomTask(
  tasks: Task[],
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
): Task[] {
  const newTask: Task = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    duration,
    rewards: {
      experience: experienceReward,
      mana: manaReward,
      mind: mindReward
    },
    icon,
    completed: false,
    cooldownHours,
    isCustom: true,
    recurrenceType,
    createdAt: new Date(),
    hasTimer,
    timerDurationMinutes: hasTimer ? timerDurationMinutes : undefined,
    timerActive: false
  };

  return [...tasks, newTask];
}

// Delete a task by ID
export function deleteTask(tasks: Task[], taskId: string): Task[] {
  return tasks.filter(t => t.id !== taskId);
}

// Get remaining cooldown in milliseconds for a task (0 if not on cooldown)
export function getTaskCooldownRemaining(task: Task): number {
  if (!task.lastCompleted || !task.cooldownHours) return 0;

  const now = new Date();
  const timeSinceCompleted = now.getTime() - task.lastCompleted.getTime();
  const cooldownMs = task.cooldownHours * 60 * 60 * 1000;
  const remaining = cooldownMs - timeSinceCompleted;
  return remaining > 0 ? remaining : 0;
}

// Get remaining timer in milliseconds for a task (0 if timer complete or no timer)
export function getTaskTimerRemaining(task: Task): number {
  if (!task.timerActive || !task.timerStartTime || !task.timerDurationMinutes) return 0;

  const now = new Date();
  const timerElapsed = now.getTime() - task.timerStartTime.getTime();
  const timerTotalMs = task.timerDurationMinutes * 60 * 1000;
  const remaining = timerTotalMs - timerElapsed;
  return remaining > 0 ? remaining : 0;
}

// Check if a task's timer has finished
export function isTaskTimerComplete(task: Task): boolean {
  if (!task.timerActive || !task.timerStartTime || !task.timerDurationMinutes) return false;
  return getTaskTimerRemaining(task) <= 0;
}

// Check if a task should reset based on its recurrence
export function shouldTaskReset(task: Task): boolean {
  if (!task.lastCompleted || !task.recurrenceType || task.recurrenceType === 'none') {
    return false;
  }

  const now = new Date();
  const lastCompleted = new Date(task.lastCompleted);
  const timeDiff = now.getTime() - lastCompleted.getTime();

  switch (task.recurrenceType) {
    case 'daily':
      // Reset if it's been more than 24 hours
      return timeDiff >= 24 * 60 * 60 * 1000;
    case 'weekly':
      // Reset if it's been more than 7 days
      return timeDiff >= 7 * 24 * 60 * 60 * 1000;
    default:
      return false;
  }
}

// Update tasks for recurrence - reset completed tasks that should recur
export function updateTasksForRecurrence(tasks: Task[]): Task[] {
  return tasks.map(task => {
    if (task.completed && shouldTaskReset(task)) {
      return {
        ...task,
        completed: false,
        lastCompleted: undefined
      };
    }
    return task;
  });
}

// ------------------ Goals support ------------------

// Helper: count completed tasks
export function getCompletedTaskCount(tasks: Task[]): number {
  return tasks.filter(t => t.completed).length;
}

// Built-in total-task goals
export function getBuiltInGoals(): Goal[] {
  return [
    {
      id: 'total-5',
      name: 'First Five Tasks',
      description: 'Complete 5 tasks total to earn a reward',
      type: 'totalTasks',
      targetNumber: 5,
      rewards: { experience: 100, mana: 5 },
      claimed: false,
      isCustom: false
    },
    {
      id: 'total-10',
      name: 'Tenacious Ten',
      description: 'Complete 10 tasks total for a bigger reward',
      type: 'totalTasks',
      targetNumber: 10,
      rewards: { experience: 250, mana: 10, mind: 5 },
      claimed: false,
      isCustom: false
    },
    {
      id: 'total-25',
      name: 'Quarter Century',
      description: 'Complete 25 tasks total for major rewards',
      type: 'totalTasks',
      targetNumber: 25,
      rewards: { experience: 700, mana: 25, mind: 15 },
      claimed: false,
      isCustom: false
    }
  ];
}

// Returns merged goals for display: built-in goals with claimed status merged from wizard, plus custom goals
export function getGoalsForWizard(wizard: Wizard | null, tasks: Task[]): Goal[] {
  const completedCount = getCompletedTaskCount(tasks);
  const builtin = getBuiltInGoals();
  const storedGoals = (wizard && wizard.goals) ? wizard.goals : [];

  // Map stored goals by id for quick lookup
  const storedById: { [id: string]: Goal } = {};
  storedGoals.forEach(g => { storedById[g.id] = g; });

  // Merge built-in goals with stored claimed flags
  const mergedBuiltins = builtin.map(bg => {
    const stored = storedById[bg.id];
    return {
      ...bg,
      claimed: stored ? stored.claimed : bg.claimed
    } as Goal;
  });

  // Custom goals: include stored goals that are custom
  const customGoals = storedGoals.filter(g => g.isCustom);

  // For builtins, attach progress field dynamically (not stored in type) by returning as-is and letting UI compute progress
  return [...mergedBuiltins, ...customGoals];
}

// Add a custom goal to a wizard and return updated wizard
export function addCustomGoalToWizard(wizard: Wizard, name: string, description: string, rewards: { experience: number; mana?: number; mind?: number; }): Wizard {
  const newGoal: Goal = {
    id: `custom-goal-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
    name,
    description,
    type: 'custom',
    rewards,
    createdAt: new Date(),
    claimed: false,
    isCustom: true
  };

  const updatedWizard = { ...wizard } as Wizard & { goals?: Goal[] };
  updatedWizard.goals = [...(updatedWizard.goals || []), newGoal];
  return updatedWizard;
}

// Claim a goal reward (built-in or custom) if progress meets target; returns updated wizard
export function claimGoal(wizard: Wizard, goalId: string, tasks: Task[]): Wizard {
  const goals = wizard.goals || [];
  const completedCount = getCompletedTaskCount(tasks);

  // Built-in goals
  const builtin = getBuiltInGoals().find(g => g.id === goalId);
  if (builtin) {
    if (completedCount < builtin.targetNumber) return wizard; // not ready

    // Apply rewards
    const updatedWizard = { ...wizard } as Wizard & { goals?: Goal[] };
    updatedWizard.experience += builtin.rewards.experience;
    if (builtin.rewards.mana) {
      updatedWizard.maxMana += builtin.rewards.mana;
      updatedWizard.mana = Math.min(updatedWizard.mana + builtin.rewards.mana, updatedWizard.maxMana);
    }
    if (builtin.rewards.mind) {
      updatedWizard.maxMind += builtin.rewards.mind;
      updatedWizard.mind = Math.min(updatedWizard.mind + builtin.rewards.mind, updatedWizard.maxMind);
    }

    // Mark claimed in wizard.goals so it persists
    updatedWizard.goals = [...(updatedWizard.goals || [])];
    const existingIndex = updatedWizard.goals.findIndex(g => g.id === builtin.id);
    const claimedEntry: Goal = { ...builtin, claimed: true };
    if (existingIndex >= 0) {
      updatedWizard.goals[existingIndex] = claimedEntry;
    } else {
      updatedWizard.goals.push(claimedEntry);
    }

    return checkLevelUp(updatedWizard);
  }

  // Custom goals: manual claim
  const idx = goals.findIndex(g => g.id === goalId && g.isCustom);
  if (idx === -1) return wizard;

  const goal = goals[idx];
  if (goal.claimed) return wizard;

  // Apply rewards (manual claim)
  const updatedWizard = { ...wizard } as Wizard & { goals?: Goal[] };
  updatedWizard.experience += goal.rewards.experience;
  if (goal.rewards.mana) {
    updatedWizard.maxMana += goal.rewards.mana;
    updatedWizard.mana = Math.min(updatedWizard.mana + goal.rewards.mana, updatedWizard.maxMana);
  }
  if (goal.rewards.mind) {
    updatedWizard.maxMind += goal.rewards.mind;
    updatedWizard.mind = Math.min(updatedWizard.mind + goal.rewards.mind, updatedWizard.maxMind);
  }

  updatedWizard.goals = [...(updatedWizard.goals || [])];
  updatedWizard.goals[idx] = { ...updatedWizard.goals[idx], claimed: true };

  return checkLevelUp(updatedWizard);
}

// Delete a custom goal
export function deleteGoalFromWizard(wizard: Wizard, goalId: string): Wizard {
  const updatedWizard = { ...wizard } as Wizard & { goals?: Goal[] };
  updatedWizard.goals = (updatedWizard.goals || []).filter(g => g.id !== goalId);
  return updatedWizard;
}

// ----------------------------------------------------

// Create a new wizard character
export function createWizard(name: string): Wizard {
  return {
    name: name,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    mana: 10,
    maxMana: 10,
    mind: 10,
    maxMind: 10,
    spells: []
  };
}

// Check if a task is on cooldown
export function isTaskOnCooldown(task: Task): boolean {
  if (!task.lastCompleted || !task.cooldownHours) return false;

  const now = new Date();
  const timeSinceCompleted = now.getTime() - task.lastCompleted.getTime();
  const cooldownMs = task.cooldownHours * 60 * 60 * 1000;

  return timeSinceCompleted < cooldownMs;
}

// Complete a task and apply rewards
export function completeTask(wizard: Wizard, task: Task, allTasks: Task[]): { wizard: Wizard, tasks: Task[] } {
  const updatedWizard = { ...wizard };
  const updatedTasks = allTasks.map(t => t.id === task.id ? { ...t } : t);
  const taskToUpdate = updatedTasks.find(t => t.id === task.id)!;

  // Apply rewards
  updatedWizard.experience += task.rewards.experience;

  if (task.rewards.mana) {
    updatedWizard.maxMana += task.rewards.mana;
    updatedWizard.mana = Math.min(updatedWizard.mana + task.rewards.mana, updatedWizard.maxMana);
  }

  if (task.rewards.mind) {
    updatedWizard.maxMind += task.rewards.mind;
    updatedWizard.mind = Math.min(updatedWizard.mind + task.rewards.mind, updatedWizard.maxMind);
  }

  // Mark task as completed
  taskToUpdate.completed = true;
  taskToUpdate.lastCompleted = new Date();

  // Check for level up
  const leveledWizard = checkLevelUp(updatedWizard);

  // Check for spell unlocks
  const spellsToCheck = setupSpells();
  const wizardWithSpells = checkSpellUnlocks(leveledWizard, task.id, updatedTasks, spellsToCheck);

  return { wizard: wizardWithSpells, tasks: updatedTasks };
}

// Check if the wizard should level up
export function checkLevelUp(wizard: Wizard): Wizard {
  let updatedWizard = { ...wizard };

  while (updatedWizard.experience >= updatedWizard.experienceToNext) {
    updatedWizard.level++;
    updatedWizard.experience -= updatedWizard.experienceToNext;
    updatedWizard.experienceToNext = Math.floor(updatedWizard.experienceToNext * 1.5); // Exponential growth

    // Level up bonuses
    updatedWizard.maxMana += 2;
    updatedWizard.maxMind += 2;
    updatedWizard.mana = updatedWizard.maxMana; // Full heal on level up
    updatedWizard.mind = updatedWizard.maxMind;
  }

  return updatedWizard;
}

// Check if any spells should be unlocked
export function checkSpellUnlocks(wizard: Wizard, completedTaskId: string, tasks: Task[], spells: Spell[]): Wizard {
  const updatedWizard = { ...wizard };

  spells.forEach(spell => {
    if (updatedWizard.spells.includes(spell.id)) return; // Already unlocked

    let shouldUnlock = false;

    if (spell.unlockRequirement.level && updatedWizard.level >= spell.unlockRequirement.level) {
      shouldUnlock = true;
    }

    if (spell.unlockRequirement.tasksCompleted) {
      const completedTasks = tasks.filter(t => t.completed).length;
      if (completedTasks >= spell.unlockRequirement.tasksCompleted) {
        shouldUnlock = true;
      }
    }

    if (spell.unlockRequirement.specialTask === completedTaskId) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      updatedWizard.spells.push(spell.id);
    }
  });

  return updatedWizard;
}


// TODO Check loading of game data functions for any overlaps or redundancies with the new multi-wizard data structure and refactor as needed.


// Multi-wizard support types
interface WizardProfile {
  wizard: Wizard;
  tasks: Task[];
}

interface AllWizardData {
  currentWizardName: string;
  wizards: { [wizardName: string]: WizardProfile };
}

// Save game data to localStorage
export function saveGameData(wizard: Wizard, tasks: Task[]): void {
  const gameData: WizardProfile = {
    wizard: wizard,
    tasks: tasks.map(task => ({
      ...task,
      lastCompleted: task.lastCompleted?.toISOString() as any
    }))
  };

  // Load all wizards data
  const allData = getAllWizardsData();
  allData.wizards[wizard.name] = gameData;
  allData.currentWizardName = wizard.name;
  localStorage.setItem('wizardTrainingGame', JSON.stringify(allData));
}

// Load game data from localStorage
export function loadGameData(): { wizard: Wizard | null, tasks: Task[] } {
  const allData = getAllWizardsData();

  if (!allData.currentWizardName || !allData.wizards[allData.currentWizardName]) {
    return { wizard: null, tasks: setupTasks() };
  }

  try {
    const gameData = allData.wizards[allData.currentWizardName];
    const wizard = gameData.wizard;

    // Restore tasks with proper Date objects
    let tasks = gameData.tasks.map((task: any) => ({
      ...task,
      lastCompleted: task.lastCompleted ? new Date(task.lastCompleted) : undefined,
      createdAt: task.createdAt ? new Date(task.createdAt) : undefined
    }));

    // Check for task recurrence and reset completed tasks that should recur
    tasks = updateTasksForRecurrence(tasks);

    return { wizard, tasks };
  } catch (error) {
    console.error('Failed to load game data:', error);
    return { wizard: null, tasks: setupTasks() };
  }
}

// Get all wizards data from localStorage
export function getAllWizardsData(): AllWizardData {
  const savedData = localStorage.getItem('wizardTrainingGame');

  if (!savedData) {
    return {
      currentWizardName: '',
      wizards: {}
    };
  }

  try {
    const data = JSON.parse(savedData);
    // Handle legacy format (single wizard)
    if (data.wizard && !data.wizards) {
      return {
        currentWizardName: data.wizard.name,
        wizards: {
          [data.wizard.name]: data
        }
      };
    }
    return data;
  } catch (error) {
    console.error('Failed to load all wizards data:', error);
    return {
      currentWizardName: '',
      wizards: {}
    };
  }
}

// Get list of all wizard names
export function getWizardNames(): string[] {
  const allData = getAllWizardsData();
  return Object.keys(allData.wizards);
}

// Switch to a different wizard
export function switchWizard(wizardName: string): { wizard: Wizard | null, tasks: Task[] } {
  const allData = getAllWizardsData();

  if (!allData.wizards[wizardName]) {
    return { wizard: null, tasks: setupTasks() };
  }

  allData.currentWizardName = wizardName;
  localStorage.setItem('wizardTrainingGame', JSON.stringify(allData));

  const gameData = allData.wizards[wizardName];
  const wizard = gameData.wizard;

  let tasks = gameData.tasks.map((task: any) => ({
    ...task,
    lastCompleted: task.lastCompleted ? new Date(task.lastCompleted) : undefined,
    createdAt: task.createdAt ? new Date(task.createdAt) : undefined
  }));

  tasks = updateTasksForRecurrence(tasks);
  return { wizard, tasks };
}

// Clear data for a specific wizard
export function clearWizardData(wizardName: string): void {
  const allData = getAllWizardsData();

  if (allData.wizards[wizardName]) {
    delete allData.wizards[wizardName];
  }

  // If we deleted the current wizard, switch to the first available
  if (allData.currentWizardName === wizardName) {
    const remainingWizards = Object.keys(allData.wizards);
    allData.currentWizardName = remainingWizards.length > 0 ? remainingWizards[0] : '';
  }

  localStorage.setItem('wizardTrainingGame', JSON.stringify(allData));
}

// Clear all game data
export function clearAllGameData(): void {
  localStorage.removeItem('wizardTrainingGame');
}