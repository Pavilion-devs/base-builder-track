'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { WalletConnect } from '@/components/ui/WalletConnect';
import { TaskBoard, TaskDetailModal, CreateTaskModal } from '@/components/workspace';
import { useRequireWallet } from '@/lib/hooks/useRequireWallet';
import { useWorkspaceTasks } from '@/lib/hooks/useWorkspaceTasks';
import { useClaimTask, useSubmitTask, useApproveTask, useCancelTask } from '@/lib/hooks/useTaskActions';
import { useReadContract } from 'wagmi';
import { WORKSPACE_ABI } from '@/lib/contracts';

export default function AllTasksPage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useRequireWallet();
  const workspaceAddress = params.id as string;

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Fetch workspace tasks
  const { tasks, taskCount, isLoading } = useWorkspaceTasks(workspaceAddress);

  // Fetch workspace name
  const { data: workspaceName } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'name',
  });

  // Task action hooks
  const claimTaskHook = useClaimTask(workspaceAddress);
  const submitTaskHook = useSubmitTask(workspaceAddress);
  const approveTaskHook = useApproveTask(workspaceAddress);
  const cancelTaskHook = useCancelTask(workspaceAddress);

  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailOpen(true);
  };

  const handleCloseTaskDetail = () => {
    setIsTaskDetailOpen(false);
    setSelectedTaskId(null);
  };

  if (!isConnected || !workspaceName) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
          <p className="text-neutral-600 tracking-tight">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-neutral-200 p-6 hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight mb-1">
            TABSY<span className="align-super text-[0.5em] font-medium ml-1">™</span>
          </h2>
          <p className="text-xs text-neutral-500 tracking-tight">Onchain Workspace</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full text-left block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg tracking-tight transition-colors"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => router.push(`/workspace/${workspaceAddress}`)}
            className="w-full text-left block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg tracking-tight transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => router.push(`/workspace/${workspaceAddress}/tasks`)}
            className="w-full text-left block px-4 py-2 text-sm font-medium bg-neutral-100 rounded-lg tracking-tight"
          >
            All Tasks
          </button>
          <button
            onClick={() => router.push(`/workspace/${workspaceAddress}/members`)}
            className="w-full text-left block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg tracking-tight transition-colors"
          >
            Members
          </button>
          <button
            onClick={() => router.push(`/workspace/${workspaceAddress}/treasury`)}
            className="w-full text-left block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg tracking-tight transition-colors"
          >
            Treasury
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="border-b-2 border-neutral-200 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">All Tasks</h1>
            <p className="text-sm text-neutral-600 tracking-tight">
              {workspaceName as string} • {taskCount} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setIsCreateTaskOpen(true)}
            >
              New Task
            </Button>
            <WalletConnect />
          </div>
        </header>

        {/* Tasks */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
              <p className="text-neutral-600 tracking-tight">Loading tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            <TaskBoard tasks={tasks} onTaskClick={handleTaskClick} />
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                <Plus className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight mb-4">No tasks yet</h3>
              <p className="text-neutral-600 tracking-tight mb-8">
                Create your first task to get started
              </p>
              <Button
                variant="primary"
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setIsCreateTaskOpen(true)}
              >
                Create First Task
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSuccess={() => {
          setIsCreateTaskOpen(false);
          window.location.reload();
        }}
        workspaceAddress={workspaceAddress}
      />

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={isTaskDetailOpen}
          onClose={handleCloseTaskDetail}
          task={{
            ...selectedTask,
            createdAt: 'Recently',
            deliverable: selectedTask.deliverableLink,
            comments: []
          }}
          onClaim={() => {
            claimTaskHook.claimTask(selectedTask.id);
            handleCloseTaskDetail();
          }}
          onSubmit={(deliverableLink: string) => {
            submitTaskHook.submitTask(selectedTask.id, deliverableLink);
            handleCloseTaskDetail();
          }}
          onApprove={() => {
            approveTaskHook.approveTask(selectedTask.id);
            handleCloseTaskDetail();
          }}
          onReject={() => {
            cancelTaskHook.cancelTask(selectedTask.id);
            handleCloseTaskDetail();
          }}
        />
      )}
    </div>
  );
}
