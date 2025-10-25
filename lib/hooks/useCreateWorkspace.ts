'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WORKSPACE_FACTORY_ADDRESS, WORKSPACE_FACTORY_ABI } from '@/lib/contracts';

export function useCreateWorkspace() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const createWorkspace = (name: string, description: string) => {
    writeContract({
      address: WORKSPACE_FACTORY_ADDRESS,
      abi: WORKSPACE_FACTORY_ABI,
      functionName: 'createWorkspace',
      args: [name, description],
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
