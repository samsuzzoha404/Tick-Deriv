import { useQuery } from '@tanstack/react-query';
import { getCurrentRound, getRound } from '@/lib/qubic/contract';
import { REFETCH_INTERVALS } from '@/config/constants';

export function useCurrentRound() {
  return useQuery({
    queryKey: ['currentRound'],
    queryFn: getCurrentRound,
    refetchInterval: REFETCH_INTERVALS.tick,
    staleTime: 0,
  });
}

export function useRound(roundId: number) {
  return useQuery({
    queryKey: ['round', roundId],
    queryFn: () => getRound(roundId),
    refetchInterval: REFETCH_INTERVALS.rounds,
  });
}
