import { Round, Bet, Tick, PriceData, BetDirection, ClaimableWinnings } from '@/types';
import { QUBIC_CONFIG, DEMO_MODE } from '@/config/constants';
import { qubicWallet } from './wallet';

// Mock data generators for demo mode
let currentTick = Math.floor(Date.now() / 1000);
let currentPrice = 45000 + Math.random() * 5000;
let roundId = 100;

const generateMockRound = (id: number, resolved = false): Round => {
  const startPrice = 45000 + Math.random() * 5000;
  const endPrice = resolved ? startPrice + (Math.random() - 0.5) * 500 : null;
  const result = endPrice ? (endPrice > startPrice ? 'UP' : 'DOWN') : null;
  
  return {
    id,
    startTick: currentTick - (resolved ? QUBIC_CONFIG.roundDuration : Math.floor(Math.random() * QUBIC_CONFIG.roundDuration)),
    endTick: currentTick + (resolved ? 0 : QUBIC_CONFIG.roundDuration - Math.floor(Math.random() * QUBIC_CONFIG.roundDuration)),
    startPrice,
    endPrice,
    result,
    totalPool: 5000 + Math.random() * 10000,
    upPool: 2500 + Math.random() * 5000,
    downPool: 2500 + Math.random() * 5000,
    status: resolved ? 'resolved' : 'active',
  };
};

const generateMockBet = (roundId: number, won: boolean | null = null): Bet => ({
  id: `bet-${Math.random().toString(36).slice(2)}`,
  roundId,
  address: DEMO_MODE.mockAddress,
  direction: Math.random() > 0.5 ? 'UP' : 'DOWN',
  amount: 100 + Math.random() * 500,
  timestamp: Date.now() - Math.random() * 86400000,
  claimed: won !== null ? Math.random() > 0.3 : false,
  won,
  payout: won ? (100 + Math.random() * 500) * 1.96 : null,
});

// Contract interaction functions
export async function getLiveTick(): Promise<Tick> {
  if (DEMO_MODE.enabled) {
    currentTick++;
    return {
      tick: currentTick,
      timestamp: Date.now(),
    };
  }

  // Real API call
  const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/tick`);
  return response.json();
}

export async function getCurrentPrice(): Promise<PriceData> {
  if (DEMO_MODE.enabled) {
    currentPrice += (Math.random() - 0.5) * 100;
    return {
      price: currentPrice,
      change24h: (Math.random() - 0.5) * 10,
      timestamp: Date.now(),
    };
  }

  // Real price from QX
  const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/price`);
  return response.json();
}

export async function getCurrentRound(): Promise<Round> {
  if (DEMO_MODE.enabled) {
    return generateMockRound(roundId);
  }

  const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/round/current`);
  return response.json();
}

export async function getRound(id: number): Promise<Round> {
  if (DEMO_MODE.enabled) {
    return generateMockRound(id, id < roundId);
  }

  const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/round/${id}`);
  return response.json();
}

export async function getRoundsHistory(limit = 20): Promise<Round[]> {
  if (DEMO_MODE.enabled) {
    return Array.from({ length: limit }, (_, i) => 
      generateMockRound(roundId - i - 1, true)
    );
  }

  const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/rounds?limit=${limit}`);
  return response.json();
}

export async function placeBet(direction: BetDirection, amount: number): Promise<{ txHash: string; bet: Bet }> {
  const wallet = qubicWallet.getState();
  if (!wallet.connected) {
    throw new Error('Wallet not connected');
  }

  if (amount < QUBIC_CONFIG.minBet || amount > QUBIC_CONFIG.maxBet) {
    throw new Error(`Bet amount must be between ${QUBIC_CONFIG.minBet} and ${QUBIC_CONFIG.maxBet}`);
  }

  if (amount > wallet.balance) {
    throw new Error('Insufficient balance');
  }

  if (DEMO_MODE.enabled) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    qubicWallet.deductBalance(amount);
    
    const bet: Bet = {
      id: `bet-${Math.random().toString(36).slice(2)}`,
      roundId,
      address: wallet.address!,
      direction,
      amount,
      timestamp: Date.now(),
      claimed: false,
      won: null,
      payout: null,
    };

    return {
      txHash: `0x${Math.random().toString(16).slice(2)}`,
      bet,
    };
  }

  // Real contract interaction
  const txData = { direction, amount, round: roundId };
  const signature = await qubicWallet.signTransaction(txData);
  
  const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/bet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...txData, signature }),
  });

  return response.json();
}

export async function getUserBets(address: string): Promise<Bet[]> {
  if (DEMO_MODE.enabled) {
    return Array.from({ length: 10 }, (_, i) => 
      generateMockBet(roundId - i - 1, i < 7 ? Math.random() > 0.5 : null)
    );
  }

  const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/user/${address}/bets`);
  return response.json();
}

export async function getUserClaimable(address: string): Promise<ClaimableWinnings[]> {
  if (DEMO_MODE.enabled) {
    const claimable: ClaimableWinnings[] = [];
    for (let i = 0; i < 3; i++) {
      if (Math.random() > 0.5) {
        claimable.push({
          roundId: roundId - i - 5,
          amount: 100 + Math.random() * 500,
          direction: Math.random() > 0.5 ? 'UP' : 'DOWN',
        });
      }
    }
    return claimable;
  }

  const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/user/${address}/claimable`);
  return response.json();
}

export async function claimWinnings(roundId: number): Promise<{ txHash: string; amount: number }> {
  const wallet = qubicWallet.getState();
  if (!wallet.connected) {
    throw new Error('Wallet not connected');
  }

  if (DEMO_MODE.enabled) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const amount = 100 + Math.random() * 500;
    qubicWallet.addBalance(amount);
    return {
      txHash: `0x${Math.random().toString(16).slice(2)}`,
      amount,
    };
  }

  const txData = { roundId, action: 'claim' };
  const signature = await qubicWallet.signTransaction(txData);
  
  const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...txData, signature }),
  });

  return response.json();
}

// Helper to calculate expected payout
export function calculatePayout(amount: number, direction: BetDirection, round: Round): number {
  const pool = direction === 'UP' ? round.upPool : round.downPool;
  const oppositePool = direction === 'UP' ? round.downPool : round.upPool;
  const totalAfterFee = (pool + oppositePool) * (1 - QUBIC_CONFIG.houseFee);
  const share = amount / (pool + amount);
  return totalAfterFee * share;
}
