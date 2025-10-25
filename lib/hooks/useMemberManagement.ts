import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WORKSPACE_ABI } from '@/lib/contracts';

/**
 * Hook for adding a member to the workspace (owner only)
 */
export function useAddMember(workspaceAddress: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const addMember = (memberAddress: string, memberName: string) => {
    writeContract({
      address: workspaceAddress as `0x${string}`,
      abi: WORKSPACE_ABI,
      functionName: 'addMember',
      args: [memberAddress as `0x${string}`, memberName],
    });
  };

  return {
    addMember,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for removing a member from the workspace (owner only)
 */
export function useRemoveMember(workspaceAddress: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const removeMember = (memberAddress: string) => {
    writeContract({
      address: workspaceAddress as `0x${string}`,
      abi: WORKSPACE_ABI,
      functionName: 'removeMember',
      args: [memberAddress as `0x${string}`],
    });
  };

  return {
    removeMember,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
