import { useQuery } from '@tanstack/react-query';
import { qubicConnector } from '@/lib/qubic/connector';
import { useWalletContext } from '@/hooks/useWalletContext';
import { REFETCH_INTERVALS } from '@/config/constants';

/**
 * Hook to fetch and poll Qubic wallet balance using TanStack Query
 * Polls every 2 seconds when wallet is connected
 */
export function useQubicBalance() {
  const { connected, address } = useWalletContext();

  return useQuery({
    queryKey: ['qubicBalance', address],
    queryFn: async (): Promise<number> => {
      if (!connected || !address) {
        return 0;
      }
      return qubicConnector.getBalance(address);
    },
    enabled: connected && !!address,
    refetchInterval: 2000, // Poll every 2 seconds
    staleTime: 1000,
    retry: 2,
    retryDelay: 1000,
  });
}

/**
 * Hook to fetch balance for any address (not just connected wallet)
 */
export function useAddressBalance(address: string | null | undefined) {
  return useQuery({
    queryKey: ['addressBalance', address],
    queryFn: async (): Promise<number> => {
      if (!address) {
        return 0;
      }
      return qubicConnector.getBalance(address);
    },
    enabled: !!address,
    refetchInterval: REFETCH_INTERVALS.balance,
    staleTime: 2000,
    retry: 2,
    retryDelay: 1000,
  });
}
