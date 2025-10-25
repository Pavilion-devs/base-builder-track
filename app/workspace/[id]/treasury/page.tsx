'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wallet, Plus, ArrowDownToLine } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { WalletConnect } from '@/components/ui/WalletConnect';
import { FundTreasuryModal } from '@/components/workspace';
import { useRequireWallet } from '@/lib/hooks/useRequireWallet';
import { useReadContract } from 'wagmi';
import { WORKSPACE_ABI } from '@/lib/contracts';

export default function TreasuryPage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useRequireWallet();
  const workspaceAddress = params.id as string;
  const [isFundTreasuryOpen, setIsFundTreasuryOpen] = useState(false);

  // Fetch workspace data
  const { data: workspaceName } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'name',
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

  const treasuryETH = treasury ? Number(treasury) / 1e18 : 0;
  const totalETH = balance ? Number(balance) / 1e18 : 0;
  const lockedETH = totalETH - treasuryETH;

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
            className="w-full text-left block px-4 py-2 text-sm font-medium bg-neutral-100 rounded-lg tracking-tight"
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
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Treasury</h1>
            <p className="text-sm text-neutral-600 tracking-tight">
              {workspaceName as string}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setIsFundTreasuryOpen(true)}
            >
              Fund Treasury
            </Button>
            <WalletConnect />
          </div>
        </header>

        {/* Treasury Stats */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card variant="violet">
              <div className="p-8 text-center">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-violet-600" />
                <div className="text-sm text-neutral-600 tracking-tight mb-2">Available Balance</div>
                <div className="text-4xl font-bold tracking-tight">
                  {treasuryETH.toFixed(6)} ETH
                </div>
                <p className="text-xs text-neutral-500 tracking-tight mt-2">
                  Can be used for new tasks
                </p>
              </div>
            </Card>

            <Card variant="amber">
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <div className="text-sm text-neutral-600 tracking-tight mb-2">Locked in Tasks</div>
                <div className="text-4xl font-bold tracking-tight">
                  {lockedETH.toFixed(6)} ETH
                </div>
                <p className="text-xs text-neutral-500 tracking-tight mt-2">
                  Reserved for active tasks
                </p>
              </div>
            </Card>

            <Card variant="lime">
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-lime-100 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-sm text-neutral-600 tracking-tight mb-2">Total Balance</div>
                <div className="text-4xl font-bold tracking-tight">
                  {totalETH.toFixed(6)} ETH
                </div>
                <p className="text-xs text-neutral-500 tracking-tight mt-2">
                  Available + Locked
                </p>
              </div>
            </Card>
          </div>

          {/* Treasury Info */}
          <div className="bg-neutral-50 border-2 border-neutral-200 rounded-[28px] p-8">
            <h3 className="text-xl font-semibold tracking-tight mb-4">How Treasury Works</h3>
            <div className="space-y-4 text-sm text-neutral-600 tracking-tight">
              <div className="flex gap-3">
                <span className="text-lg">💰</span>
                <div>
                  <p className="font-medium text-black mb-1">Fund Treasury</p>
                  <p>Add ETH to the treasury to fund task bounties. Anyone can fund the treasury.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="font-medium text-black mb-1">Locked Funds</p>
                  <p>When tasks are created, their bounty is locked from the available balance until the task is completed or cancelled.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">✅</span>
                <div>
                  <p className="font-medium text-black mb-1">Payment Release</p>
                  <p>When tasks are approved, the locked bounty is automatically released to the worker.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">↩️</span>
                <div>
                  <p className="font-medium text-black mb-1">Withdraw Funds</p>
                  <p>The workspace owner can withdraw available (unlocked) funds at any time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Address */}
          <div className="mt-8 p-6 bg-white border-2 border-black rounded-lg">
            <p className="text-sm font-medium tracking-tight mb-2">Workspace Contract</p>
            <p className="text-xs text-neutral-600 tracking-tight font-mono break-all">
              {workspaceAddress}
            </p>
          </div>
        </div>
      </main>

      {/* Fund Treasury Modal */}
      <FundTreasuryModal
        isOpen={isFundTreasuryOpen}
        onClose={() => setIsFundTreasuryOpen(false)}
        onSuccess={() => {
          setIsFundTreasuryOpen(false);
          window.location.reload();
        }}
        workspaceAddress={workspaceAddress}
      />
    </div>
  );
}
