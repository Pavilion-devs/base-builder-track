'use client';

import { useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

/**
 * Automatically switches wallet to the correct network based on environment
 * This fixes the issue where wallet stays on mainnet when app expects testnet
 */
export function NetworkSwitcher() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Determine expected chain based on environment
  const useMainnet = process.env.NEXT_PUBLIC_USE_MAINNET === 'true';
  const expectedChainId = useMainnet ? base.id : baseSepolia.id;
  const expectedChainName = useMainnet ? 'Base' : 'Base Sepolia';

  useEffect(() => {
    // Only run if wallet is connected and on wrong network
    if (isConnected && chainId !== expectedChainId && switchChain) {
      console.log(`Wrong network detected. Switching from ${chainId} to ${expectedChainId} (${expectedChainName})`);

      try {
        switchChain({ chainId: expectedChainId });
      } catch (error) {
        console.error('Failed to switch network:', error);
        // Show user-friendly error
        alert(
          `Please switch your wallet to ${expectedChainName} network manually.\n\n` +
          `Current: Chain ID ${chainId}\n` +
          `Expected: ${expectedChainName} (Chain ID ${expectedChainId})`
        );
      }
    }
  }, [isConnected, chainId, expectedChainId, switchChain, expectedChainName]);

  // Show warning banner if on wrong network
  if (isConnected && chainId !== expectedChainId) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 border-b-4 border-black p-3 text-center">
        <p className="font-bold text-black">
          ⚠️ Wrong Network! Please switch to <strong>{expectedChainName}</strong> in your wallet.
        </p>
        <p className="text-sm text-black/80 mt-1">
          Current: Chain ID {chainId} | Expected: {expectedChainName} (Chain ID {expectedChainId})
        </p>
      </div>
    );
  }

  return null;
}
