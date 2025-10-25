'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCreateTask } from '@/lib/hooks/useCreateTask';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workspaceAddress: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSuccess,
  workspaceAddress,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bounty, setBounty] = useState('');
  const [deadline, setDeadline] = useState('');

  const {
    createTask,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useCreateTask(workspaceAddress);

  const isProcessing = isPending || isConfirming;

  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        onSuccess();
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
        setBounty('');
        setDeadline('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, onSuccess, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !bounty || !deadline) {
      alert('Please fill in all fields');
      return;
    }

    const bountyInWei = BigInt(Math.floor(parseFloat(bounty) * 1e18));
    const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

    createTask(title, description, bountyInWei, BigInt(deadlineTimestamp));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isProcessing ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white border-8 border-black rounded-[28px] shadow-brutal-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black">
          <h2 className="text-2xl font-bold tracking-tight">Create New Task</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {isConfirmed && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-lime-100 border-4 border-black rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-lime-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Task Created!</h3>
            <p className="text-neutral-600 tracking-tight">
              Your task has been successfully created onchain.
            </p>
          </div>
        )}

        {/* Form */}
        {!isConfirmed && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium tracking-tight mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build landing page"
                disabled={isProcessing}
                className="w-full px-4 py-3 border-2 border-black rounded-lg tracking-tight focus:outline-none focus:ring-4 focus:ring-black/10 disabled:bg-neutral-100 disabled:opacity-50"
                maxLength={100}
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium tracking-tight mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be done..."
                disabled={isProcessing}
                rows={4}
                className="w-full px-4 py-3 border-2 border-black rounded-lg tracking-tight focus:outline-none focus:ring-4 focus:ring-black/10 disabled:bg-neutral-100 disabled:opacity-50 resize-none"
                maxLength={500}
              />
            </div>

            {/* Bounty Amount */}
            <div>
              <label className="block text-sm font-medium tracking-tight mb-2">
                Bounty Amount (ETH) *
              </label>
              <input
                type="number"
                value={bounty}
                onChange={(e) => setBounty(e.target.value)}
                placeholder="0.0001"
                step="0.0001"
                min="0"
                disabled={isProcessing}
                className="w-full px-4 py-3 border-2 border-black rounded-lg tracking-tight focus:outline-none focus:ring-4 focus:ring-black/10 disabled:bg-neutral-100 disabled:opacity-50"
              />
              <p className="text-xs text-neutral-600 tracking-tight mt-2">
                Amount to be paid upon task completion
              </p>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium tracking-tight mb-2">
                Deadline *
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={isProcessing}
                className="w-full px-4 py-3 border-2 border-black rounded-lg tracking-tight focus:outline-none focus:ring-4 focus:ring-black/10 disabled:bg-neutral-100 disabled:opacity-50"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-600 rounded-lg">
                <p className="text-sm text-red-600 tracking-tight">
                  Error: {error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isProcessing || !title || !description || !bounty || !deadline}
                className="flex-1"
              >
                {isPending && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirm in Wallet...
                  </>
                )}
                {isConfirming && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Task...
                  </>
                )}
                {!isProcessing && 'Create Task'}
              </Button>
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="text-center">
                <p className="text-sm text-neutral-600 tracking-tight">
                  {isPending && '⏳ Waiting for wallet confirmation...'}
                  {isConfirming && '⛓️ Transaction processing onchain...'}
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
