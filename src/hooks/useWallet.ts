import { useState, useEffect, useCallback } from 'react';
import { qubicWallet } from '@/lib/qubic/wallet';
import { WalletState } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useWallet() {
  const [state, setState] = useState<WalletState>(qubicWallet.getState());
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = qubicWallet.subscribe(setState);
    return unsubscribe;
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      await qubicWallet.connect();
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
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    await qubicWallet.disconnect();
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  }, [toast]);

  return {
    ...state,
    isConnecting,
    connect,
    disconnect,
  };
}
