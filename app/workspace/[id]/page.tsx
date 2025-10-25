'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Users, Wallet, Sparkles, Settings, UserPlus } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { WalletConnect } from '@/components/ui/WalletConnect';
import { TaskBoard, TaskCardProps, TaskDetailModal, CreateTaskModal, FundTreasuryModal, AddMemberModal } from '@/components/workspace';
import { useRequireWallet } from '@/lib/hooks/useRequireWallet';
import { useWorkspaceTasks } from '@/lib/hooks/useWorkspaceTasks';
import { useClaimTask, useSubmitTask, useApproveTask, useCancelTask } from '@/lib/hooks/useTaskActions';
import { useReadContract } from 'wagmi';
import { WORKSPACE_ABI } from '@/lib/contracts';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useRequireWallet();
  const workspaceAddress = params.id as string;

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isAICreateOpen, setIsAICreateOpen] = useState(false);
  const [isFundTreasuryOpen, setIsFundTreasuryOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Fetch workspace tasks from blockchain
  const { tasks, taskCount: fetchedTaskCount, isLoading: isLoadingTasks } = useWorkspaceTasks(workspaceAddress);

  // Task action hooks
  const claimTaskHook = useClaimTask(workspaceAddress);
  const submitTaskHook = useSubmitTask(workspaceAddress);
  const approveTaskHook = useApproveTask(workspaceAddress);
  const cancelTaskHook = useCancelTask(workspaceAddress);

  // Fetch workspace details from blockchain
  const { data: workspaceName } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'name',
  });

  const { data: workspaceDescription } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'description',
  });

  const { data: memberAddresses } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'getMembers',
  });

  const memberCount = memberAddresses ? (memberAddresses as string[]).length : 0;

  const { data: taskCount } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'taskCount',
  });

  const { data: treasury } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'treasury',
  });

  const { data: balance } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'getBalance',
  });

  const selectedTask = selectedTaskId
    ? tasks.find(t => t.id === selectedTaskId)
    : null;

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailOpen(true);
  };

  const handleCloseTaskDetail = () => {
    setIsTaskDetailOpen(false);
    setSelectedTaskId(null);
  };

  const handleTaskCreated = () => {
    // Refetch workspace data after task creation
    // In the future, we'll have a refetch function here
    console.log('Task created successfully!');
  };

  // Loading state
  if (!isConnected || !workspaceName) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
          <p className="text-neutral-600 tracking-tight">Loading workspace...</p>
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
            className="w-full text-left block px-4 py-2 text-sm font-medium bg-neutral-100 rounded-lg tracking-tight"
          >
            Overview
          </button>
          <button
            onClick={() => router.push(`/workspace/${workspaceAddress}/tasks`)}
            className="w-full text-left block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg tracking-tight transition-colors"
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

        <div className="mt-8 pt-8 border-t border-neutral-200">
          <div className="bg-violet-50 border-2 border-black rounded-lg p-4">
            <p className="text-xs font-medium tracking-tight mb-2">Workspace Address</p>
            <p className="text-xs text-neutral-600 tracking-tight break-all">
              {workspaceAddress}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="border-b-2 border-neutral-200 p-6">
          <div className="flex items-end justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-semibold tracking-tight mb-2">
                {workspaceName as string}
              </h1>
              <p className="text-lg text-neutral-600 tracking-tight">
                {workspaceDescription as string}
              </p>
            </div>
            <WalletConnect />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span>{treasury ? (Number(treasury) / 1e18).toFixed(6) : '0'} ETH treasury</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                icon={<Wallet className="w-5 h-5" />}
                onClick={() => setIsFundTreasuryOpen(true)}
              >
                Fund Treasury
              </Button>
              <Button
                variant="secondary"
                icon={<UserPlus className="w-5 h-5" />}
                onClick={() => setIsAddMemberOpen(true)}
              >
                Add Member
              </Button>
              <Button
                variant="primary"
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setIsCreateTaskOpen(true)}
              >
                New Task
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-6 border-b-2 border-neutral-200 bg-neutral-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="violet">
              <div className="p-6">
                <div className="text-sm text-neutral-600 tracking-tight mb-2">Treasury Balance</div>
                <div className="text-2xl font-bold tracking-tight">
                  {treasury ? (Number(treasury) / 1e18).toFixed(6) : '0'} ETH
                </div>
                <p className="text-xs text-neutral-500 tracking-tight mt-1">
                  Total: {balance ? (Number(balance) / 1e18).toFixed(6) : '0'} ETH
                </p>
              </div>
            </Card>
            <Card variant="lime">
              <div className="p-6">
                <div className="text-sm text-neutral-600 tracking-tight mb-2">Total Tasks</div>
                <div className="text-2xl font-bold tracking-tight">
                  {isLoadingTasks ? '...' : fetchedTaskCount}
                </div>
              </div>
            </Card>
            <Card variant="amber">
              <div className="p-6">
                <div className="text-sm text-neutral-600 tracking-tight mb-2">Team Members</div>
                <div className="text-2xl font-bold tracking-tight">
                  {memberCount}
                </div>
              </div>
            </Card>
            <Card variant="rose">
              <div className="p-6">
                <div className="text-sm text-neutral-600 tracking-tight mb-2">Active Tasks</div>
                <div className="text-2xl font-bold tracking-tight">
                  {isLoadingTasks ? '...' : tasks.filter(t => t.status === 'in_progress' || t.status === 'open').length}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Task Board */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Tasks</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/workspace/${workspaceAddress}/tasks`)}
            >
              View All →
            </Button>
          </div>

          {isLoadingTasks ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
              <p className="text-neutral-600 tracking-tight">Loading tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            <TaskBoard
              tasks={tasks}
              onTaskClick={handleTaskClick}
            />
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight mb-4">
                No tasks yet
              </h3>
              <p className="text-neutral-600 tracking-tight mb-8">
                Create your first task to start collaborating
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

      {/* Floating AI Button - Notion Style */}
      <button
        onClick={() => setIsAICreateOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 border-4 border-black rounded-full shadow-brutal hover:scale-110 transition-transform flex items-center justify-center group z-40"
        title="Create with AI"
      >
        <Sparkles className="w-6 h-6 text-white" />
        <span className="absolute right-full mr-3 px-3 py-2 bg-black text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Create with AI
        </span>
      </button>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSuccess={handleTaskCreated}
        workspaceAddress={workspaceAddress}
      />

      {/* Fund Treasury Modal */}
      <FundTreasuryModal
        isOpen={isFundTreasuryOpen}
        onClose={() => setIsFundTreasuryOpen(false)}
        onSuccess={handleTaskCreated}
        workspaceAddress={workspaceAddress}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSuccess={handleTaskCreated}
        workspaceAddress={workspaceAddress}
      />

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={isTaskDetailOpen}
          onClose={handleCloseTaskDetail}
          task={{
            ...selectedTask,
            createdAt: 'Nov 20, 2024',
            deliverable: selectedTask.status === 'submitted' || selectedTask.status === 'completed'
              ? 'https://github.com/example/pull/123'
              : undefined,
            comments: selectedTask.status === 'submitted' ? [
              {
                author: 'Task Creator',
                text: 'Looking forward to reviewing this!',
                timestamp: '2 hours ago'
              }
            ] : []
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
