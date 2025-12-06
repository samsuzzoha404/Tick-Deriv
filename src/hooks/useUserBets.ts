import { useQuery } from '@tanstack/react-query';
import { getUserBets, getUserClaimable } from '@/lib/qubic/contract';
import { REFETCH_INTERVALS } from '@/config/constants';
import { useWallet } from './useWallet';

export function useUserBets() {
  const { address, connected } = useWallet();

  return useQuery({
    queryKey: ['userBets', address],
    queryFn: () => getUserBets(address!),
    enabled: connected && !!address,
    refetchInterval: REFETCH_INTERVALS.rounds,
  });
}

export function useUserClaimable() {
  const { address, connected } = useWallet();

  return useQuery({
    queryKey: ['userClaimable', address],
    queryFn: () => getUserClaimable(address!),
    enabled: connected && !!address,
    refetchInterval: REFETCH_INTERVALS.rounds,
  });
}
