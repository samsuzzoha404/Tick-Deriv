import { useState, useCallback } from 'react';
import { useWalletContext } from '@/hooks/useWalletContext';
import { useToast } from '@/hooks/use-toast';
import { useQubicBalance } from '@/hooks/useQubicBalance';

export function useWallet() {
  const walletContext = useWalletContext();
  const { toast } = useToast();
  const { data: liveBalance } = useQubicBalance();
  const [seedInput, setSeedInput] = useState('');

  const connect = useCallback(async (seed?: string) => {
    const seedToUse = seed ?? seedInput;
    
    if (!seedToUse || seedToUse.length < 55) {
      toast({
        title: 'Invalid Seed',
        description: 'Seed must be at least 55 characters',
        variant: 'destructive',
      });
      return;
    }

    try {
      await walletContext.connectWallet(seedToUse);
      setSeedInput('');
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to your wallet',
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  }, [walletContext, seedInput, toast]);

  const disconnect = useCallback(() => {
    walletContext.disconnectWallet();
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  }, [walletContext, toast]);

  // Use live balance from TanStack Query if available, otherwise use context balance
  const rawBalance = liveBalance ?? walletContext.balance;
  // Ensure balance is always a valid number
  const balance = !isNaN(rawBalance) && isFinite(rawBalance) ? rawBalance : 0;

  return {
    connected: walletContext.connected,
    address: walletContext.address,
    balance,
    isConnecting: walletContext.isConnecting,
    error: walletContext.error,
    connect,
    connectDemoWallet: walletContext.connectDemoWallet,
    disconnect,
    disconnectWallet: walletContext.disconnectWallet,
    seedInput,
    setSeedInput,
    signAndSendTx: walletContext.signAndSendTx,
    refreshBalance: walletContext.refreshBalance,
    isDemoMode: walletContext.isDemoMode,
  };
}
