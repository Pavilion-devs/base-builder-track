import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WORKSPACE_ABI } from '@/lib/contracts';

/**
 * Hook for claiming an open task
 */
export function useClaimTask(workspaceAddress: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const claimTask = (taskId: string) => {
    writeContract({
      address: workspaceAddress as `0x${string}`,
      abi: WORKSPACE_ABI,
      functionName: 'claimTask',
      args: [BigInt(taskId)],
    });
  };

  return {
    claimTask,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for submitting completed work for a task
 */
export function useSubmitTask(workspaceAddress: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const submitTask = (taskId: string, deliverableLink: string) => {
    writeContract({
      address: workspaceAddress as `0x${string}`,
      abi: WORKSPACE_ABI,
      functionName: 'submitTask',
      args: [BigInt(taskId), deliverableLink],
    });
  };

  return {
    submitTask,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for approving a submitted task and releasing payment
 */
export function useApproveTask(workspaceAddress: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const approveTask = (taskId: string) => {
    writeContract({
      address: workspaceAddress as `0x${string}`,
      abi: WORKSPACE_ABI,
      functionName: 'approveTask',
      args: [BigInt(taskId)],
    });
  };

  return {
    approveTask,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for canceling a task (by creator or owner)
 */
export function useCancelTask(workspaceAddress: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelTask = (taskId: string) => {
    writeContract({
      address: workspaceAddress as `0x${string}`,
      abi: WORKSPACE_ABI,
      functionName: 'cancelTask',
      args: [BigInt(taskId)],
    });
  };

  return {
    cancelTask,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
