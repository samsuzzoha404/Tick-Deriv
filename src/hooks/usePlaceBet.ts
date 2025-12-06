import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placeBet, claimWinnings } from '@/lib/qubic/contract';
import { BetDirection } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function usePlaceBet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ direction, amount }: { direction: BetDirection; amount: number }) =>
      placeBet(direction, amount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      queryClient.invalidateQueries({ queryKey: ['currentRound'] });
      toast({
        title: 'Bet Placed!',
        description: `Your ${data.bet.direction} bet of ${data.bet.amount} QU has been placed`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Bet Failed',
        description: error instanceof Error ? error.message : 'Failed to place bet',
        variant: 'destructive',
      });
    },
  });
}

export function useClaimWinnings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (roundId: number) => claimWinnings(roundId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userClaimable'] });
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      toast({
        title: 'Winnings Claimed!',
        description: `You received ${data.amount.toFixed(2)} QU`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Claim Failed',
        description: error instanceof Error ? error.message : 'Failed to claim winnings',
        variant: 'destructive',
      });
    },
  });
}
