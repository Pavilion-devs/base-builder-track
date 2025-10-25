'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { useCreateWorkspace } from '@/lib/hooks/useCreateWorkspace';
import { CheckCircle, Loader } from 'lucide-react';

export interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const {
    createWorkspace,
    isPending,
    isConfirming,
    isConfirmed,
    error
  } = useCreateWorkspace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && description) {
      createWorkspace(name, description);
    }
  };

  // Close modal and trigger success callback when confirmed
  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        onSuccess?.();
        onClose();
        // Reset form
        setName('');
        setDescription('');
      }, 2000);
    }
  }, [isConfirmed, onSuccess, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 sm:p-8 lg:p-10">
        {!isConfirmed ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">
              Create New Workspace
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Workspace Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium tracking-tight mb-2"
                >
                  Workspace Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Web3 Builders"
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg
                           focus:outline-none focus:border-black transition-colors
                           text-base tracking-tight"
                  required
                  disabled={isPending || isConfirming}
                />
              </div>

              {/* Workspace Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium tracking-tight mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this workspace for?"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg
                           focus:outline-none focus:border-black transition-colors
                           text-base tracking-tight resize-none"
                  required
                  disabled={isPending || isConfirming}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 tracking-tight">
                    {error.message || 'Failed to create workspace. Please try again.'}
                  </p>
                </div>
              )}

              {/* Info Message */}
              <div className="bg-violet-50 border-2 border-violet-200 rounded-lg p-4">
                <p className="text-xs text-neutral-600 tracking-tight">
                  <strong>Note:</strong> Creating a workspace will deploy a new smart contract on Base.
                  This requires a blockchain transaction and gas fees.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={!name || !description || isPending || isConfirming}
                  icon={
                    isPending || isConfirming ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : undefined
                  }
                >
                  {isPending
                    ? 'Confirm in Wallet...'
                    : isConfirming
                    ? 'Creating Workspace...'
                    : 'Create Workspace'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isPending || isConfirming}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        ) : (
          // Success State
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight mb-3">
              Workspace Created! 🎉
            </h3>
            <p className="text-neutral-600 tracking-tight mb-6">
              Your workspace <strong>{name}</strong> has been deployed to Base blockchain.
            </p>
            <div className="text-sm text-neutral-500 tracking-tight">
              Refreshing your workspaces...
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreateWorkspaceModal;
