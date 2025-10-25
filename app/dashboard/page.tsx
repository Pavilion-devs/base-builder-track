'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { WorkspaceCard, CreateWorkspaceModal } from '@/components/workspace';
import { WalletConnect } from '@/components/ui/WalletConnect';
import { useRequireWallet } from '@/lib/hooks/useRequireWallet';
import { useUserWorkspaces } from '@/lib/hooks/useUserWorkspaces';
import { useReadContract } from 'wagmi';
import { WORKSPACE_FACTORY_ADDRESS, WORKSPACE_FACTORY_ABI } from '@/lib/contracts';

export default function Dashboard() {
  const router = useRouter();
  const { address, isConnected } = useRequireWallet();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch user's workspaces from blockchain
  const { workspaces, isLoading: isLoadingWorkspaces, refetch } = useUserWorkspaces();

  // Get total workspace count for stats
  const { data: totalWorkspaceCount } = useReadContract({
    address: WORKSPACE_FACTORY_ADDRESS,
    abi: WORKSPACE_FACTORY_ABI,
    functionName: 'getWorkspaceCount',
  });

  // Show loading state while checking wallet connection
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
          <p className="text-neutral-600 tracking-tight">Checking wallet connection...</p>
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
          <a
            href="/dashboard"
            className="block px-4 py-2 text-sm font-medium bg-neutral-100 rounded-lg tracking-tight"
          >
            Workspaces
          </a>
          <a
            href="/dashboard/tasks"
            className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg tracking-tight transition-colors"
          >
            All Tasks
          </a>
          <a
            href="/dashboard/settings"
            className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg tracking-tight transition-colors"
          >
            Settings
          </a>
        </nav>

        <div className="mt-8 pt-8 border-t border-neutral-200">
          <div className="bg-violet-50 border-2 border-black rounded-lg p-4">
            <p className="text-xs font-medium tracking-tight mb-2">Need Help?</p>
            <p className="text-xs text-neutral-600 tracking-tight mb-3">
              Check out our docs to get started
            </p>
            <button className="text-xs font-medium text-blue-600 hover:underline tracking-tight">
              View Docs →
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="border-b-2 border-neutral-200 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1">
              Your Workspaces
            </h1>
            <p className="text-sm text-neutral-600 tracking-tight">
              Manage teams, track tasks, and execute payments onchain
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon={<Sparkles className="w-5 h-5" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create with AI
            </Button>
            <Button
              variant="secondary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Workspace
            </Button>
            <WalletConnect />
          </div>
        </header>

        {/* Contract Status Section */}
        <div className="p-6 border-b-2 border-neutral-200 bg-neutral-50">
          <div className="max-w-4xl">
            <h3 className="text-sm font-semibold tracking-tight mb-3">🔗 Contract Status</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-black rounded-lg p-4">
                <p className="text-xs text-neutral-600 tracking-tight mb-1">Total Workspaces</p>
                <p className="text-2xl font-bold tracking-tight">
                  {totalWorkspaceCount?.toString() || '0'}
                </p>
              </div>
              <div className="bg-white border-2 border-black rounded-lg p-4">
                <p className="text-xs text-neutral-600 tracking-tight mb-1">Your Workspaces</p>
                <p className="text-2xl font-bold tracking-tight">
                  {isLoadingWorkspaces ? '...' : workspaces.length}
                </p>
              </div>
              <div className="bg-white border-2 border-black rounded-lg p-4">
                <p className="text-xs text-neutral-600 tracking-tight mb-1">Chain</p>
                <p className="text-sm font-bold tracking-tight">
                  {process.env.NEXT_PUBLIC_USE_MAINNET === 'true' ? 'Base Mainnet' : 'Base Sepolia'} ✅
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  {WORKSPACE_FACTORY_ADDRESS.slice(0, 6)}...
                  {WORKSPACE_FACTORY_ADDRESS.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workspaces Grid */}
        <div className="p-6">
          {isLoadingWorkspaces ? (
            /* Loading State */
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
              <p className="text-neutral-600 tracking-tight">Loading your workspaces...</p>
            </div>
          ) : workspaces.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  id={workspace.address}
                  name={workspace.name}
                  description={workspace.description}
                  memberCount={workspace.memberCount}
                  taskCount={workspace.taskCount}
                  activeTasks={workspace.activeTasks}
                  treasury={`${workspace.treasury} ETH`}
                  onClick={() => router.push(`/workspace/${workspace.address}`)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-4">
                  No workspaces yet
                </h3>
                <p className="text-neutral-600 tracking-tight mb-8">
                  Create your first workspace to start collaborating with your team onchain.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Sparkles className="w-5 h-5" />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Your First Workspace
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
