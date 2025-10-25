'use client';

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { WORKSPACE_FACTORY_ADDRESS, WORKSPACE_FACTORY_ABI, WORKSPACE_ABI } from '@/lib/contracts';

export function useUserWorkspaces() {
  const { address } = useAccount();

  // Get user's workspace addresses
  const { data: workspaceAddresses, isLoading, refetch } = useReadContract({
    address: WORKSPACE_FACTORY_ADDRESS,
    abi: WORKSPACE_FACTORY_ABI,
    functionName: 'getUserWorkspaces',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Fetch details for each workspace
  const workspaceContracts = (workspaceAddresses as `0x${string}`[] | undefined)?.map((workspaceAddress) => [
    {
      address: workspaceAddress,
      abi: WORKSPACE_ABI,
      functionName: 'name',
    },
    {
      address: workspaceAddress,
      abi: WORKSPACE_ABI,
      functionName: 'description',
    },
    {
      address: workspaceAddress,
      abi: WORKSPACE_ABI,
      functionName: 'treasury',
    },
    {
      address: workspaceAddress,
      abi: WORKSPACE_ABI,
      functionName: 'taskCount',
    },
    {
      address: workspaceAddress,
      abi: WORKSPACE_ABI,
      functionName: 'getMembers',
    },
  ]) || [];

  const { data: workspaceDetails, isLoading: isLoadingDetails } = useReadContracts({
    contracts: workspaceContracts.flat(),
    query: {
      enabled: !!workspaceAddresses && workspaceAddresses.length > 0,
    },
  });

  // Format the workspace data
  const workspaces = (workspaceAddresses as `0x${string}`[] | undefined)?.map((address, index) => {
    const detailsStartIndex = index * 5;
    const name = workspaceDetails?.[detailsStartIndex]?.result as string || 'Unnamed Workspace';
    const description = workspaceDetails?.[detailsStartIndex + 1]?.result as string || '';
    const treasury = workspaceDetails?.[detailsStartIndex + 2]?.result as bigint || 0n;
    const taskCount = workspaceDetails?.[detailsStartIndex + 3]?.result as bigint || 0n;
    const members = workspaceDetails?.[detailsStartIndex + 4]?.result as `0x${string}`[] || [];

    return {
      id: address,
      address,
      name,
      description,
      treasury: (Number(treasury) / 1e18).toFixed(6),
      taskCount: Number(taskCount),
      memberCount: members.length,
      activeTasks: 0, // TODO: Calculate from task statuses
    };
  }) || [];

  return {
    workspaces,
    isLoading: isLoading || isLoadingDetails,
    refetch,
  };
}
