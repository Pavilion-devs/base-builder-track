'use client';

import React, { useState } from 'react';
import { Modal, Badge, Button } from '@/components/ui';
import { User, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { TaskStatus } from './TaskCard';

export interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
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
    createdAt: string;
    deliverable?: string;
    comments?: Array<{
      author: string;
      text: string;
      timestamp: string;
    }>;
  };
  onClaim?: () => void;
  onSubmit?: (deliverableLink: string) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

const statusConfig = {
  open: { label: 'Open', variant: 'success' as const },
  assigned: { label: 'Assigned', variant: 'info' as const },
  in_progress: { label: 'In Progress', variant: 'warning' as const },
  submitted: { label: 'Submitted', variant: 'warning' as const },
  completed: { label: 'Completed', variant: 'neutral' as const }
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onClaim,
  onSubmit,
  onApprove,
  onReject
}) => {
  const [deliverableLink, setDeliverableLink] = useState('');
  const [showDeliverableInput, setShowDeliverableInput] = useState(false);
  const statusInfo = statusConfig[task.status];

  const handleSubmit = () => {
    if (deliverableLink.trim() && onSubmit) {
      onSubmit(deliverableLink.trim());
      setDeliverableLink('');
      setShowDeliverableInput(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      {/* 2-Column Layout */}
      <div className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
        {/* Left - Preview/Image Section */}
        <div className="bg-gradient-to-br from-violet-100 to-lime-100 rounded-l-[20px] p-8 lg:p-10 flex flex-col justify-center">
          <div className="space-y-6">
            {/* Status Badge */}
            <div>
              <Badge variant={statusInfo.variant} size="md">
                {statusInfo.label}
              </Badge>
            </div>

            {/* Bounty Display */}
            <div className="bg-white/90 backdrop-blur border-4 border-black rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-neutral-700" />
                <span className="text-sm text-neutral-600 tracking-tight uppercase">Bounty</span>
              </div>
              <div className="text-4xl font-bold tracking-tight">{task.bounty}</div>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              {task.assignee && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center border-2 border-black">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium tracking-tight">{task.assignee.name}</div>
                    <div className="text-neutral-600 text-xs tracking-tight">{task.assignee.address}</div>
                  </div>
                </div>
              )}

              {task.deadline && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center border-2 border-black">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium tracking-tight">Deadline</div>
                    <div className="text-neutral-600 text-xs tracking-tight">{task.deadline}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Content Section */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
          <div className="flex-1 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
                {task.title}
              </h2>
              <p className="text-xs text-neutral-500 tracking-tight uppercase">
                Created {task.createdAt}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium tracking-tight mb-3 text-neutral-700 uppercase">
                Description
              </h3>
              <p className="text-neutral-600 leading-relaxed tracking-tight">
                {task.description}
              </p>
            </div>

            {/* Deliverable (if submitted) */}
            {task.deliverable && (
              <div>
                <h3 className="text-sm font-medium tracking-tight mb-3 text-neutral-700 uppercase">
                  Deliverable
                </h3>
                <div className="bg-neutral-50 border-2 border-neutral-200 rounded-lg p-4">
                  <a
                    href={task.deliverable}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline tracking-tight"
                  >
                    {task.deliverable}
                  </a>
                </div>
              </div>
            )}

            {/* Comments */}
            {task.comments && task.comments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium tracking-tight mb-3 text-neutral-700 uppercase">
                  Comments
                </h3>
                <div className="space-y-3">
                  {task.comments.map((comment, index) => (
                    <div key={index} className="bg-neutral-50 border-2 border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium tracking-tight">{comment.author}</span>
                        <span className="text-xs text-neutral-500 tracking-tight">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-neutral-600 tracking-tight">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t-2 border-neutral-200 mt-6">
            {task.status === 'open' && onClaim && (
              <Button
                variant="primary"
                className="flex-1"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={onClaim}
              >
                Claim Task
              </Button>
            )}

            {['assigned', 'in_progress'].includes(task.status) && onSubmit && (
              <>
                {!showDeliverableInput ? (
                  <Button
                    variant="primary"
                    className="flex-1"
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => setShowDeliverableInput(true)}
                  >
                    Submit Work
                  </Button>
                ) : (
                  <div className="flex-1 space-y-3">
                    <input
                      type="url"
                      value={deliverableLink}
                      onChange={(e) => setDeliverableLink(e.target.value)}
                      placeholder="https://github.com/your-repo/pull/123"
                      className="w-full px-4 py-2 border-2 border-black rounded-lg tracking-tight text-sm focus:outline-none focus:ring-4 focus:ring-black/10"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handleSubmit}
                        disabled={!deliverableLink.trim()}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowDeliverableInput(false);
                          setDeliverableLink('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {task.status === 'submitted' && onApprove && onReject && (
              <>
                <Button
                  variant="primary"
                  className="flex-1"
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={onApprove}
                >
                  Approve & Pay
                </Button>
                <Button
                  variant="ghost"
                  icon={<XCircle className="w-4 h-4" />}
                  onClick={onReject}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
