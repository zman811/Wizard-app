import React, { useState } from 'react';
import { Task } from '../types';
import { isTaskOnCooldown, getTaskCooldownRemaining, getTaskTimerRemaining, isTaskTimerComplete } from '../gameLogic';

interface TasksListProps {
  tasks: Task[];
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
  onEditTask?: (
    taskId: string,
    updates: Partial<Task>
  ) => void;
}

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  onCompleteTask,
  onAddTask,
  onDeleteTask,
  onEditTask
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    duration: 30,
    experienceReward: 10,
    manaReward: 0,
    mindReward: 0,
    recurrenceType: 'daily' as 'daily' | 'weekly' | 'none',
    icon: '📝',
    cooldownHours: 24,
    hasTimer: false,
    timerDurationMinutes: 0
  });
  const [editTask, setEditTask] = useState({
    name: '',
    description: '',
    duration: 30,
    experienceReward: 10,
    manaReward: 0,
    mindReward: 0,
    recurrenceType: 'daily' as 'daily' | 'weekly' | 'none',
    icon: '📝',
    cooldownHours: 24,
    hasTimer: false,
    timerDurationMinutes: 0
  });

  // Tick to refresh cooldown timers every second
  const [, setTick] = useState(0);
  React.useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  // Handle input changes for new task form
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setNewTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission for adding new task
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name.trim()) return;

    onAddTask(
      newTask.name.trim(),
      newTask.description.trim(),
      newTask.duration,
      newTask.experienceReward,
      newTask.manaReward || undefined,
      newTask.mindReward || undefined,
      newTask.recurrenceType,
      newTask.icon,
      newTask.cooldownHours,
      newTask.hasTimer,
      newTask.timerDurationMinutes
    );

    // Reset form
    setNewTask({
      name: '',
      description: '',
      duration: 30,
      experienceReward: 10,
      manaReward: 0,
      mindReward: 0,
      recurrenceType: 'daily',
      icon: '📝',
      cooldownHours: 24,
      hasTimer: false,
      timerDurationMinutes: 0
    });
    setShowAddForm(false);
  };

  // Handle starting to edit a task
  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTask({
      name: task.name,
      description: task.description,
      duration: task.duration,
      experienceReward: task.rewards.experience,
      manaReward: task.rewards.mana || 0,
      mindReward: task.rewards.mind || 0,
      recurrenceType: task.recurrenceType || 'daily',
      icon: task.icon,
      cooldownHours: task.cooldownHours || 0,
      hasTimer: task.hasTimer || false,
      timerDurationMinutes: task.timerDurationMinutes || 0
    });
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTask({
      name: '',
      description: '',
      duration: 30,
      experienceReward: 10,
      manaReward: 0,
      mindReward: 0,
      recurrenceType: 'daily',
      icon: '📝',
      cooldownHours: 24,
      hasTimer: false,
      timerDurationMinutes: 0
    });
  };

  // Handle saving edited task
  const handleSaveEdit = () => {
    if (!editingTaskId || !onEditTask) return;

    onEditTask(editingTaskId, {
      name: editTask.name,
      description: editTask.description,
      duration: editTask.duration,
      rewards: {
        experience: editTask.experienceReward,
        mana: editTask.manaReward || undefined,
        mind: editTask.mindReward || undefined
      },
      recurrenceType: editTask.recurrenceType,
      icon: editTask.icon,
      cooldownHours: editTask.cooldownHours,
      hasTimer: editTask.hasTimer,
      timerDurationMinutes: editTask.timerDurationMinutes
    });

    handleCancelEdit();
  };

  // Handle edit input changes
  const handleEditInputChange = (field: string, value: string | number | boolean) => {
    setEditTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="tasks-section">
      <div className="tasks-header">
        <h3>Daily Tasks</h3>
        <button
          className="add-task-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-task-form" onSubmit={handleAddTaskSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Task name"
              value={newTask.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Icon emoji"
              value={newTask.icon}
              onChange={(e) => handleInputChange('icon', e.target.value)}
              maxLength={2}
            />
            <div className="form-group">
              <label>Cooldown (hours):</label>
              <input
                type="number"
                min="0"
                max="168"
                value={newTask.cooldownHours}
                onChange={(e) => handleInputChange('cooldownHours', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={2}
          />

          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes):</label>
              <input
                type="number"
                min="1"
                max="480"
                value={newTask.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 30)}
              />
            </div>

            <div className="form-group">
              <label>Experience Reward:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={newTask.experienceReward}
                onChange={(e) => handleInputChange('experienceReward', parseInt(e.target.value) || 10)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mana Reward:</label>
              <input
                type="number"
                min="0"
                max="20"
                value={newTask.manaReward}
                onChange={(e) => handleInputChange('manaReward', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Mind Reward:</label>
              <input
                type="number"
                min="0"
                max="20"
                value={newTask.mindReward}
                onChange={(e) => handleInputChange('mindReward', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Recurrence:</label>
              <select
                value={newTask.recurrenceType}
                onChange={(e) => handleInputChange('recurrenceType', e.target.value as 'daily' | 'weekly' | 'none')}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="none">One-time</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Enable Timer?</label>
              <input
                type="checkbox"
                checked={newTask.hasTimer}
                onChange={(e) => handleInputChange('hasTimer', e.target.checked)}
              />
            </div>
            {newTask.hasTimer && (
              <div className="form-group">
                <label>Timer Duration (minutes):</label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={newTask.timerDurationMinutes}
                  onChange={(e) => handleInputChange('timerDurationMinutes', parseInt(e.target.value) || 0)}
                />
              </div>
            )}
          </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Cooldown (hours):</label>
                      <input
                        type="number"
                        min="0"
                        max="168"
                        value={editTask.cooldownHours}
                        onChange={(e) => handleEditInputChange('cooldownHours', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Task</button>
            <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="tasks-list">
        {tasks.map(task => {
          const isOnCooldown = isTaskOnCooldown(task);
          const remainingMs = getTaskCooldownRemaining(task);
          const formatRemaining = (ms: number) => {
            if (ms <= 0) return '00:00';
            const total = Math.floor(ms / 1000);
            const hours = Math.floor(total / 3600);
            const minutes = Math.floor((total % 3600) / 60);
            const seconds = total % 60;
            if (hours > 0) return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
            return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
          };
          const canComplete = !task.completed && !isOnCooldown;
          const isEditing = editingTaskId === task.id;

          if (isEditing) {
            return (
              <div key={task.id} className="task-item editing">
                <form className="edit-task-form" onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Task name"
                      value={editTask.name}
                      onChange={(e) => handleEditInputChange('name', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Icon emoji"
                      value={editTask.icon}
                      onChange={(e) => handleEditInputChange('icon', e.target.value)}
                      maxLength={2}
                    />
                  </div>

                  <textarea
                    placeholder="Task description"
                    value={editTask.description}
                    onChange={(e) => handleEditInputChange('description', e.target.value)}
                    rows={2}
                  />

                  <div className="form-row">
                    <div className="form-group">
                      <label>Duration (minutes):</label>
                      <input
                        type="number"
                        min="1"
                        max="480"
                        value={editTask.duration}
                        onChange={(e) => handleEditInputChange('duration', parseInt(e.target.value) || 30)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Experience Reward:</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={editTask.experienceReward}
                        onChange={(e) => handleEditInputChange('experienceReward', parseInt(e.target.value) || 10)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Mana Reward:</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={editTask.manaReward}
                        onChange={(e) => handleEditInputChange('manaReward', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Mind Reward:</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={editTask.mindReward}
                        onChange={(e) => handleEditInputChange('mindReward', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Recurrence:</label>
                      <select
                        value={editTask.recurrenceType}
                        onChange={(e) => handleEditInputChange('recurrenceType', e.target.value as 'daily' | 'weekly' | 'none')}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="none">One-time</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Enable Timer?</label>
                      <input
                        type="checkbox"
                        checked={editTask.hasTimer}
                        onChange={(e) => handleEditInputChange('hasTimer', e.target.checked)}
                      />
                    </div>
                    {editTask.hasTimer && (
                      <div className="form-group">
                        <label>Timer Duration (minutes):</label>
                        <input
                          type="number"
                          min="1"
                          max="480"
                          value={editTask.timerDurationMinutes}
                          onChange={(e) => handleEditInputChange('timerDurationMinutes', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Save Changes</button>
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </form>
              </div>
            );
          }

          return (
            <div key={task.id} className="task-item">
              <div className="task-info">
                <div className="task-name">
                  {task.icon} {task.name}
                </div>
                <div className="task-description">{task.description}</div>

                {/* Timer Display */}
                {task.hasTimer && task.timerDurationMinutes ? (
                  <div className="task-timer-section">
                    {task.timerActive ? (
                      <div className="timer-display">
                        <span className="timer-label">⏱️ Timer:</span>
                        <span className="timer-countdown">{formatRemaining(getTaskTimerRemaining(task))}</span>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="task-rewards">
                  Rewards: {task.rewards.experience} XP
                  {task.rewards.mana ? `, +${task.rewards.mana} Mana` : ''}
                  {task.rewards.mind ? `, +${task.rewards.mind} Mind` : ''}
                  {task.recurrenceType && task.recurrenceType !== 'none' && (
                    <span className="recurrence-info"> • {task.recurrenceType}</span>
                  )}
                </div>
                {isOnCooldown && remainingMs > 0 && (
                  <div className="cooldown-timer">Back in: {formatRemaining(remainingMs)}</div>
                )}
              </div>
              <div className="task-actions">
                {task.hasTimer && task.timerDurationMinutes ? (
                  <>
                    {task.timerActive ? (
                      <button
                        className="timer-btn active"
                        onClick={() => {
                          if (onEditTask) {
                            onEditTask(task.id, { timerActive: false });
                          }
                        }}
                      >
                        ⏸️ Stop Timer
                      </button>
                    ) : (
                      <>
                        <button
                          className="timer-btn"
                          onClick={() => {
                            if (onEditTask) {
                              onEditTask(task.id, {
                                timerActive: true,
                                timerStartTime: new Date()
                              });
                            }
                          }}
                        >
                          ▶️ Start Timer
                        </button>
                        <button
                          className="task-btn"
                          disabled={!canComplete}
                          onClick={() => onCompleteTask(task)}
                        >
                          {task.completed ? 'Completed' : isOnCooldown ? 'Cooldown' : 'Complete'}
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <button
                    className="task-btn"
                    disabled={!canComplete}
                    onClick={() => onCompleteTask(task)}
                  >
                    {task.completed ? 'Completed' : isOnCooldown ? 'Cooldown' : 'Complete'}
                  </button>
                )}
                <div className="task-controls">
                  <button
                    className="edit-btn"
                    onClick={() => handleStartEdit(task)}
                    title="Edit task"
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksList;