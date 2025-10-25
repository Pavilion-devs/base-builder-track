import { useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi';
import { WORKSPACE_ABI } from '@/lib/contracts';
import { parseEther } from 'viem';

/**
 * Hook for funding workspace treasury
 * Uses sendTransaction to send ETH directly to the workspace contract
 */
export function useFundTreasury(workspaceAddress: string) {
  const { data: hash, sendTransaction, isPending, error } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const fundTreasury = (amountInEth: string) => {
    sendTransaction({
      to: workspaceAddress as `0x${string}`,
      value: parseEther(amountInEth),
    });
  };

  return {
    fundTreasury,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for withdrawing funds from treasury (owner only)
 */
export function useWithdrawFunds(workspaceAddress: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const withdrawFunds = (amountInEth: string) => {
    const amountInWei = parseEther(amountInEth);
    writeContract({
      address: workspaceAddress as `0x${string}`,
      abi: WORKSPACE_ABI,
      functionName: 'withdrawFunds',
      args: [amountInWei],
    });
  };

  return {
    withdrawFunds,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
