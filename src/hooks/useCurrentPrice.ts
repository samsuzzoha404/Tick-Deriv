import { useQuery } from '@tanstack/react-query';
import { getCurrentPrice } from '@/lib/qubic/contract';
import { REFETCH_INTERVALS } from '@/config/constants';

export function useCurrentPrice() {
  return useQuery({
    queryKey: ['currentPrice'],
    queryFn: getCurrentPrice,
    refetchInterval: REFETCH_INTERVALS.price,
    staleTime: 0,
  });
}
