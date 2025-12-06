import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { CountdownTimer } from '@/components/bet/CountdownTimer';
import { PriceDisplay } from '@/components/bet/PriceDisplay';
import { BetDirectionSelector } from '@/components/bet/BetDirectionSelector';
import { BetAmountInput } from '@/components/bet/BetAmountInput';
import { PayoutCalculator } from '@/components/bet/PayoutCalculator';
import { RoundInfo } from '@/components/bet/RoundInfo';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useWallet } from '@/hooks/useWallet';
import { usePlaceBet } from '@/hooks/usePlaceBet';
import { useCurrentRound } from '@/hooks/useRound';
import { BetDirection } from '@/types';
import { QUBIC_CONFIG } from '@/config/constants';
import { Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PlaceBet() {
  const [searchParams] = useSearchParams();
  const initialDirection = searchParams.get('direction') as BetDirection | null;

  const [direction, setDirection] = useState<BetDirection | null>(initialDirection);
  const [amount, setAmount] = useState(100);
  const [betPlaced, setBetPlaced] = useState(false);

  const { connected, balance, connect, isConnecting } = useWallet();
  const { mutate: placeBet, isPending: isPlacingBet } = usePlaceBet();
  const { data: round } = useCurrentRound();

  useEffect(() => {
    if (initialDirection) {
      setDirection(initialDirection);
    }
  }, [initialDirection]);

  const handlePlaceBet = () => {
    if (!direction || amount <= 0) return;

    placeBet(
      { direction, amount },
      {
        onSuccess: () => {
          setBetPlaced(true);
          setTimeout(() => setBetPlaced(false), 3000);
          setDirection(null);
          setAmount(100);
        },
      }
    );
  };

  const canPlaceBet = connected && direction && amount >= QUBIC_CONFIG.minBet && amount <= balance;

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Place Your Bet</h1>
          <p className="text-muted-foreground">
            Predict the price direction and win up to 1.96x your stake
          </p>
        </div>

        {!connected ? (
          <GlassCard className="p-8 text-center max-w-md mx-auto">
            <Wallet className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to start placing bets on Tick-Deriv
            </p>
            <Button
              onClick={connect}
              disabled={isConnecting}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isConnecting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </GlassCard>
        ) : betPlaced ? (
          <GlassCard className="p-8 text-center max-w-md mx-auto" glow="primary">
            <CheckCircle2 className="h-16 w-16 text-up mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Bet Placed Successfully!</h2>
            <p className="text-muted-foreground mb-4">
              Your bet has been submitted to the blockchain
            </p>
            <CountdownTimer size="md" />
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main betting form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price & Timer */}
              <GlassCard className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <PriceDisplay size="md" />
                  <div className="border-l border-border pl-6">
                    <CountdownTimer size="md" />
                  </div>
                </div>
              </GlassCard>

              {/* Direction Selector */}
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  1. Select Direction
                </h3>
                <BetDirectionSelector
                  selected={direction}
                  onSelect={setDirection}
                  disabled={isPlacingBet}
                />
              </GlassCard>

              {/* Amount Input */}
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  2. Enter Amount
                </h3>
                <BetAmountInput
                  value={amount}
                  onChange={setAmount}
                  maxBalance={balance}
                  disabled={isPlacingBet}
                />
              </GlassCard>

              {/* Submit Button */}
              <Button
                onClick={handlePlaceBet}
                disabled={!canPlaceBet || isPlacingBet}
                size="lg"
                className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              >
                {isPlacingBet ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Placing Bet...
                  </>
                ) : (
                  <>
                    Place Bet
                    {direction && amount > 0 && ` • ${direction} • ${amount} QU`}
                  </>
                )}
              </Button>

              {/* Warnings */}
              {amount > balance && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-down/10 text-down text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Insufficient balance
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <PayoutCalculator amount={amount} direction={direction} />
              <RoundInfo />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
