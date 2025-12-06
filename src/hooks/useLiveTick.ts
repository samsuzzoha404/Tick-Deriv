import { useQuery } from '@tanstack/react-query';
import { getLiveTick } from '@/lib/qubic/contract';
import { REFETCH_INTERVALS } from '@/config/constants';

export function useLiveTick() {
  return useQuery({
    queryKey: ['liveTick'],
    queryFn: getLiveTick,
    refetchInterval: REFETCH_INTERVALS.tick,
    staleTime: 0,
  });
}
