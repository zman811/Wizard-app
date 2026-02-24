// Game data interfaces
export interface Wizard {
  name: string;
  level: number;
  experience: number;
  experienceToNext: number;
  mana: number;
  maxMana: number;
  mind: number;
  maxMind: number;
  spells: string[];
  goals?: Goal[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  rewards: {
    experience: number;
    mana?: number;
    mind?: number;
  };
  icon: string;
  completed: boolean;
  lastCompleted?: Date;
  cooldownHours?: number;
  isCustom?: boolean; // Whether this is a user-created task
  recurrenceType?: 'daily' | 'weekly' | 'none'; // How often the task resets
  createdAt?: Date; // When the custom task was created
  hasTimer?: boolean; // Whether this task has an active timer
  timerDurationMinutes?: number; // Timer duration in minutes
  timerStartTime?: Date; // When the timer was started
  timerActive?: boolean; // Whether the timer is currently running
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockRequirement: {
    level?: number;
    tasksCompleted?: number;
    specialTask?: string;
  };
}

// Goals
export interface Goal {
  id: string;
  name: string;
  description?: string;
  type: 'totalTasks' | 'custom';
  targetNumber?: number; // e.g., number of tasks to complete (only for built-in goals)
  rewards: {
    experience: number;
    mana?: number;
    mind?: number;
  };
  createdAt?: Date;
  claimed?: boolean; // whether reward has been claimed
  isCustom?: boolean;
}