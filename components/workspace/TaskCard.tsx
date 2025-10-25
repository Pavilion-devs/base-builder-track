'use client';

import React from 'react';
import { User } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

export type TaskStatus = 'open' | 'assigned' | 'in_progress' | 'submitted' | 'completed';

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  bounty: string;
  status: TaskStatus;
  assignee?: {
    name: string;
    address: string;
  };
  deadline?: string;
  onClick?: () => void;
}

const statusConfig = {
  open: { label: 'Open', variant: 'success' as const },
  assigned: { label: 'Assigned', variant: 'info' as const },
  in_progress: { label: 'In Progress', variant: 'warning' as const },
  submitted: { label: 'Submitted', variant: 'warning' as const },
  completed: { label: 'Completed', variant: 'neutral' as const }
};

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  bounty,
  status,
  assignee,
  deadline,
  onClick
}) => {
  const statusInfo = statusConfig[status];

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <Card hover>
        {/* Card Content */}
        <div className="p-5">
          {/* Header with Status Badge */}
          <div className="flex items-start justify-between mb-3">
            <Badge variant={statusInfo.variant} size="md">
              {statusInfo.label}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold tracking-tight mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-neutral-600 text-sm tracking-tight mb-4 line-clamp-2">
            {description}
          </p>

          {/* Assignee */}
          {assignee && (
            <div className="flex items-center gap-2 mb-3 text-sm text-neutral-600">
              <User className="w-4 h-4" />
              <span className="tracking-tight truncate">{assignee.name}</span>
            </div>
          )}

          {/* Footer - Bounty and Deadline */}
          <div className="flex justify-between items-end pt-3 border-t-2 border-neutral-100">
            <div>
              <div className="text-xs text-neutral-500 tracking-tight mb-1">Bounty</div>
              <div className="text-lg font-bold tracking-tight">{bounty}</div>
            </div>
            {deadline && (
              <div className="text-right">
                <div className="text-xs text-neutral-500 tracking-tight mb-1">Deadline</div>
                <div className="text-sm font-medium tracking-tight">{deadline}</div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskCard;
