import { useQuery } from '@tanstack/react-query';
import { getRoundsHistory } from '@/lib/qubic/contract';
import { REFETCH_INTERVALS } from '@/config/constants';

export function useRoundsHistory(limit = 20) {
  return useQuery({
    queryKey: ['roundsHistory', limit],
    queryFn: () => getRoundsHistory(limit),
    refetchInterval: REFETCH_INTERVALS.rounds,
  });
}
