'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { base } from 'wagmi/chains';
import WorkspaceFactoryABI from '@/lib/contracts/abis/WorkspaceFactory.json';

const WORKSPACE_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_WORKSPACE_FACTORY_ADDRESS as `0x${string}`;

/**
 * Hook to get total workspace count
 */
export function useWorkspaceCount() {
  return useReadContract({
    address: WORKSPACE_FACTORY_ADDRESS,
    abi: WorkspaceFactoryABI,
    functionName: 'getWorkspaceCount',
    chainId: base.id,
  });
}

/**
 * Hook to get user's workspaces
 */
export function useUserWorkspaces(userAddress?: `0x${string}`) {
  return useReadContract({
    address: WORKSPACE_FACTORY_ADDRESS,
    abi: WorkspaceFactoryABI,
    functionName: 'getUserWorkspaces',
    args: userAddress ? [userAddress] : undefined,
    chainId: base.id,
    query: {
      enabled: !!userAddress,
    },
  });
}

/**
 * Hook to get all workspaces
 */
export function useAllWorkspaces() {
  return useReadContract({
    address: WORKSPACE_FACTORY_ADDRESS,
    abi: WorkspaceFactoryABI,
    functionName: 'getAllWorkspaces',
    chainId: base.id,
  });
}

/**
 * Hook to check if an address is a workspace
 */
export function useIsWorkspace(address?: `0x${string}`) {
  return useReadContract({
    address: WORKSPACE_FACTORY_ADDRESS,
    abi: WorkspaceFactoryABI,
    functionName: 'isWorkspace',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address,
    },
  });
}

/**
 * Hook to create a new workspace
 */
export function useCreateWorkspace() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const createWorkspace = (name: string, description: string) => {
    writeContract({
      address: WORKSPACE_FACTORY_ADDRESS,
      abi: WorkspaceFactoryABI,
      functionName: 'createWorkspace',
      args: [name, description],
      chainId: base.id,
    });
  };

  return {
    createWorkspace,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
