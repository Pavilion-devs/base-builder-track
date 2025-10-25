'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAddMember } from '@/lib/hooks/useMemberManagement';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workspaceAddress: string;
}

export function AddMemberModal({
  isOpen,
  onClose,
  onSuccess,
  workspaceAddress,
}: AddMemberModalProps) {
  const [memberAddress, setMemberAddress] = useState('');
  const [memberName, setMemberName] = useState('');

  const {
    addMember,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useAddMember(workspaceAddress);

  const isProcessing = isPending || isConfirming;

  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        onSuccess();
        onClose();
        setMemberAddress('');
        setMemberName('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, onSuccess, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberAddress.trim() || !memberName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Basic validation for Ethereum address
    if (!memberAddress.startsWith('0x') || memberAddress.length !== 42) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    addMember(memberAddress, memberName);
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
      <div className="relative w-full max-w-md bg-white border-8 border-black rounded-[28px] shadow-brutal-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-lime-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-500 border-2 border-black rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Add Member</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-lime-100 rounded-lg transition-colors disabled:opacity-50"
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
            <h3 className="text-2xl font-bold tracking-tight mb-2">Member Added!</h3>
            <p className="text-neutral-600 tracking-tight">
              The member has been successfully added to the workspace.
            </p>
          </div>
        )}

        {/* Form */}
        {!isConfirmed && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <p className="text-sm text-neutral-600 tracking-tight">
              Add a new member to the workspace. Members can create tasks, claim tasks, and submit work.
            </p>

            {/* Member Name */}
            <div>
              <label className="block text-sm font-medium tracking-tight mb-2">
                Member Name *
              </label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="John Doe"
                disabled={isProcessing}
                className="w-full px-4 py-3 border-2 border-black rounded-lg tracking-tight focus:outline-none focus:ring-4 focus:ring-black/10 disabled:bg-neutral-100 disabled:opacity-50"
                maxLength={50}
              />
            </div>

            {/* Wallet Address */}
            <div>
              <label className="block text-sm font-medium tracking-tight mb-2">
                Wallet Address *
              </label>
              <input
                type="text"
                value={memberAddress}
                onChange={(e) => setMemberAddress(e.target.value)}
                placeholder="0x..."
                disabled={isProcessing}
                className="w-full px-4 py-3 border-2 border-black rounded-lg tracking-tight font-mono text-sm focus:outline-none focus:ring-4 focus:ring-black/10 disabled:bg-neutral-100 disabled:opacity-50"
              />
              <p className="text-xs text-neutral-600 tracking-tight mt-2">
                The Ethereum address of the member
              </p>
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
                disabled={isProcessing || !memberAddress.trim() || !memberName.trim()}
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
                    Adding Member...
                  </>
                )}
                {!isProcessing && (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Add Member
                  </>
                )}
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
