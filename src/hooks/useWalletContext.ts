import { useContext } from 'react';
import { WalletContext } from '@/contexts/WalletContext';
import type { WalletContextValue } from '@/contexts/WalletContext';

/**
 * Hook to access wallet context
 * Must be used within a WalletProvider
 */
export function useWalletContext(): WalletContextValue {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  
  return context;
}
