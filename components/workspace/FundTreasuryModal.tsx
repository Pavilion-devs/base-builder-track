'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui';
import { useFundTreasury } from '@/lib/hooks/useTreasuryManagement';

interface FundTreasuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workspaceAddress: string;
}

export function FundTreasuryModal({
  isOpen,
  onClose,
  onSuccess,
  workspaceAddress,
}: FundTreasuryModalProps) {
  const [amount, setAmount] = useState('');

  const {
    fundTreasury,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useFundTreasury(workspaceAddress);

  const isProcessing = isPending || isConfirming;

  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        onSuccess();
        onClose();
        setAmount('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, onSuccess, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    fundTreasury(amount);
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
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-violet-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-500 border-2 border-black rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Fund Treasury</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-violet-100 rounded-lg transition-colors disabled:opacity-50"
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
            <h3 className="text-2xl font-bold tracking-tight mb-2">Funds Added!</h3>
            <p className="text-neutral-600 tracking-tight">
              Treasury has been successfully funded.
            </p>
          </div>
        )}

        {/* Form */}
        {!isConfirmed && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <p className="text-sm text-neutral-600 tracking-tight">
              Add ETH to the workspace treasury to fund task bounties. The treasury holds funds
              that are locked when tasks are created and released when tasks are approved.
            </p>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium tracking-tight mb-2">
                Amount (ETH) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0001"
                step="0.0001"
                min="0"
                disabled={isProcessing}
                className="w-full px-4 py-3 border-2 border-black rounded-lg tracking-tight text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-black/10 disabled:bg-neutral-100 disabled:opacity-50"
              />
              <p className="text-xs text-neutral-600 tracking-tight mt-2">
                Available for task bounties and payments
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
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
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
                    Processing...
                  </>
                )}
                {!isProcessing && (
                  <>
                    <Wallet className="w-5 h-5" />
                    Fund Treasury
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
