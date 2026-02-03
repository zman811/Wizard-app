import { Wizard, Task, Spell } from './types';

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
  cooldownHours: number = 24
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
    createdAt: new Date()
  };

  return [...tasks, newTask];
}

// Delete a task (only custom tasks can be deleted)
export function deleteTask(tasks: Task[], taskId: string): Task[] {
  // Allow deletion of any task (user requested editable/deletable for all tasks)
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

// Save game data to localStorage
export function saveGameData(wizard: Wizard, tasks: Task[]): void {
  const gameData = {
    wizard: wizard,
    tasks: tasks.map(task => ({
      ...task,
      lastCompleted: task.lastCompleted?.toISOString()
    }))
  };

  localStorage.setItem('wizardTrainingGame', JSON.stringify(gameData));
}

// Load game data from localStorage
export function loadGameData(): { wizard: Wizard | null, tasks: Task[] } {
  const savedData = localStorage.getItem('wizardTrainingGame');
  if (!savedData) return { wizard: null, tasks: setupTasks() };

  try {
    const gameData = JSON.parse(savedData);
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