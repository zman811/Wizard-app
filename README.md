# Wizard Training Academy 🧙‍♂️

A charming task management app themed around wizard training, inspired by Stardew Valley's cozy aesthetic. Train your wizard by completing daily tasks to level up your magical abilities and collect powerful spells!

## Features

### 🧙 Character Creation
- Create your wizard with a custom name
- Start with basic stats: Mana and Mind

### 📋 Daily Tasks
Complete various tasks to level up your wizard:
- **Physical Training** 💪 - Exercise to increase Mana
- **Study Magic** 📚 - Read to boost Mind
- **Meditate** 🧘 - Clear your mind for balanced growth
- **Spell Practice** 🔮 - Practice magic for experience
- **Connect with Nature** 🌿 - Gather magical energy
- **Social Interaction** 👥 - Learn from fellow wizards

### ✨ Spell Collection
Unlock powerful spells by reaching milestones:
- **Fireball** 🔥 - Unlock at level 2
- **Teleport** ✨ - Unlock at level 3
- **Healing Touch** 💚 - Complete 5 tasks
- **Invisibility** 👻 - Complete meditation task
- **Lightning Bolt** ⚡ - Unlock at level 5
- **Summon Familiar** 🐱 - Complete 10 tasks

### 📊 Stats System
- **Level**: Overall wizard progression
- **Mana**: Magical power capacity
- **Mind**: Mental clarity and wisdom
- **Experience**: Progress toward next level

### 🎨 Charming Design
- Stardew Valley-inspired color palette
- Warm, cozy aesthetic
- Pixel-art friendly emojis
- Responsive design

## How to Play

1. **Create Your Wizard**: Enter your wizard's name to begin
2. **Complete Tasks**: Click on available tasks to complete them and gain rewards
3. **Level Up**: Accumulate experience to increase your level and unlock new abilities
4. **Collect Spells**: Meet the requirements to unlock powerful magical spells
5. **Progress**: Keep training daily to become a master wizard!

## Technical Architecture

Built with modern React and TypeScript:

### 🏗️ **Architecture**
- **React 18** with hooks for state management
- **TypeScript** for type safety
- **Component-based architecture** with separation of concerns
- **Modular game logic** extracted to separate files

### 📁 **File Structure**
```
src/
├── components/           # React components
│   ├── App.tsx          # Main app component
│   ├── CharacterCreation.tsx
│   ├── GameScreen.tsx
│   ├── WizardStats.tsx
│   ├── TasksList.tsx
│   ├── SpellsList.tsx
│   └── App.css          # Component styles
├── types.ts             # TypeScript interfaces
├── gameLogic.ts         # Game state management functions
├── renderer.tsx         # React app entry point
├── index.html           # HTML template
├── index.css            # Global styles
└── preload.ts           # Electron preload script
```

### 🔧 **Key Components**

#### `App.tsx` - Main Application Controller
- Manages global game state with React hooks
- Handles data persistence with localStorage
- Coordinates between character creation and game screens

#### `gameLogic.ts` - Game State Management
- Pure functions for game mechanics
- Task completion, leveling, and spell unlocking logic
- Data serialization/deserialization

#### `types.ts` - Type Definitions
- TypeScript interfaces for Wizard, Task, and Spell
- Ensures type safety across the application

## Development

```bash
# Install dependencies
npm install

# Start development
npm start

# Package for distribution
npm run package

# Create distributable
npm run make
```

## Data Persistence

Your wizard's progress is automatically saved to your computer's local storage, so you can close and reopen the app without losing your training progress!