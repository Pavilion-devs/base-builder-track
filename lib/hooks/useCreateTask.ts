import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WORKSPACE_ABI } from '@/lib/contracts';

export function useCreateTask(workspaceAddress: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const createTask = (
    title: string,
    description: string,
    bounty: bigint,
    deadline: bigint,
    assignee: string = '0x0000000000000000000000000000000000000000' // address(0) for open tasks
  ) => {
    writeContract({
      address: workspaceAddress as `0x${string}`,
      abi: WORKSPACE_ABI,
      functionName: 'createTask',
      args: [title, description, bounty, deadline, assignee as `0x${string}`],
    });
  };

  return {
    createTask,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
