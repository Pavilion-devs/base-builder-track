'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserPlus, Trash2 } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { WalletConnect } from '@/components/ui/WalletConnect';
import { AddMemberModal } from '@/components/workspace';
import { useRequireWallet } from '@/lib/hooks/useRequireWallet';
import { useReadContract, useReadContracts } from 'wagmi';
import { WORKSPACE_ABI } from '@/lib/contracts';

export default function MembersPage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useRequireWallet();
  const workspaceAddress = params.id as string;
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Fetch workspace name
  const { data: workspaceName } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'name',
  });

  // Fetch member addresses
  const { data: memberAddresses } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'getMembers',
  });

  const membersList = (memberAddresses as string[]) || [];

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
            className="w-full text-left block px-4 py-2 text-sm font-medium bg-neutral-100 rounded-lg tracking-tight"
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
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Team Members</h1>
            <p className="text-sm text-neutral-600 tracking-tight">
              {workspaceName as string}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon={<UserPlus className="w-5 h-5" />}
              onClick={() => setIsAddMemberOpen(true)}
            >
              Add Member
            </Button>
            <WalletConnect />
          </div>
        </header>

        {/* Members List */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-neutral-600 tracking-tight">
              {membersList.length} {membersList.length === 1 ? 'member' : 'members'}
            </p>
          </div>

          {membersList.length > 0 ? (
            <div className="grid gap-4">
              {membersList.map((address, index) => (
                <Card key={address}>
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-lime-100 border-2 border-black rounded-full flex items-center justify-center font-bold text-lg">
                        {address.slice(2, 4).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold tracking-tight">
                          Member #{index + 1}
                        </div>
                        <div className="text-sm text-neutral-600 tracking-tight font-mono">
                          {address}
                        </div>
                      </div>
                    </div>
                    {index !== 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => console.log('Remove member:', address)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight mb-4">No members yet</h3>
              <p className="text-neutral-600 tracking-tight mb-8">
                Add team members to start collaborating
              </p>
              <Button
                variant="primary"
                icon={<UserPlus className="w-5 h-5" />}
                onClick={() => setIsAddMemberOpen(true)}
              >
                Add First Member
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSuccess={() => {
          setIsAddMemberOpen(false);
          window.location.reload();
        }}
        workspaceAddress={workspaceAddress}
      />
    </div>
  );
}
