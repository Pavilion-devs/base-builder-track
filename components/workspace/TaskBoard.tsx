'use client';

import React from 'react';
import TaskCard, { TaskCardProps } from './TaskCard';

export interface TaskBoardProps {
  tasks: TaskCardProps[];
  onTaskClick?: (taskId: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskClick }) => {
  // Group tasks by status
  const openTasks = tasks.filter(t => t.status === 'open');
  const inProgressTasks = tasks.filter(t => ['assigned', 'in_progress'].includes(t.status));
  const completedTasks = tasks.filter(t => ['submitted', 'completed'].includes(t.status));

  const Column = ({
    title,
    count,
    tasks,
    accentColor
  }: {
    title: string;
    count: number;
    tasks: TaskCardProps[];
    accentColor: string;
  }) => (
    <div className="flex-1 min-w-[300px]">
      {/* Column Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <span className={`text-sm font-medium px-2 py-1 rounded ${accentColor}`}>
            {count}
          </span>
        </div>
        <div className={`h-1 rounded-full ${accentColor.replace('text', 'bg')}`} />
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onClick={() => onTaskClick?.(task.id)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-neutral-400 text-sm tracking-tight">
            No tasks
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      <Column
        title="Open"
        count={openTasks.length}
        tasks={openTasks}
        accentColor="text-green-600 bg-green-100"
      />
      <Column
        title="In Progress"
        count={inProgressTasks.length}
        tasks={inProgressTasks}
        accentColor="text-amber-600 bg-amber-100"
      />
      <Column
        title="Completed"
        count={completedTasks.length}
        tasks={completedTasks}
        accentColor="text-neutral-600 bg-neutral-100"
      />
    </div>
  );
};

export default TaskBoard;
