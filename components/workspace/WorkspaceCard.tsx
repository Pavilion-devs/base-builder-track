'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui';

export interface WorkspaceCardProps {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  taskCount: number;
  activeTasks: number;
  treasury: string;
  onClick?: () => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  name,
  description,
  memberCount,
  taskCount,
  activeTasks,
  treasury,
  onClick
}) => {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <Card hover>
        {/* Preview/Stats Section */}
        <div className="aspect-[3/4] bg-gradient-to-br from-violet-100 to-lime-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
              {name}
            </h3>
            {description && (
              <p className="text-neutral-600 text-sm tracking-tight mb-4">
                {description}
              </p>
            )}
            <p className="text-neutral-600 text-sm">
              {memberCount} {memberCount === 1 ? 'member' : 'members'} • {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 backdrop-blur p-3 rounded-lg border-2 border-black">
              <div className="text-xs text-neutral-600 tracking-tight mb-1">Treasury</div>
              <div className="text-base sm:text-lg font-semibold tracking-tight">{treasury}</div>
            </div>
            <div className="bg-white/80 backdrop-blur p-3 rounded-lg border-2 border-black">
              <div className="text-xs text-neutral-600 tracking-tight mb-1">Active</div>
              <div className="text-base sm:text-lg font-semibold tracking-tight">{activeTasks}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-4 border-black bg-white">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium tracking-tight">Open workspace</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkspaceCard;
