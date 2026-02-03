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