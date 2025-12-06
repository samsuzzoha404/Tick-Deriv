import { Round, Bet, Tick, PriceData, BetDirection, ClaimableWinnings } from '@/types';
import { QUBIC_CONFIG } from '@/config/constants';
import { qubicConnector } from './connector';

// Simulation state for demo purposes (when TickDeriv SC is not deployed)
let simulatedRoundId = 1000;
let simulatedPrice = 0.000025; // Simulated QU price in USD

function generateSimulatedRound(id: number, tick: number, isActive = false): Round {
  const startTick = id * QUBIC_CONFIG.roundDuration;
  const endTick = (id + 1) * QUBIC_CONFIG.roundDuration;
  const basePool = Math.floor(Math.random() * 50000) + 10000;
  const upPool = Math.floor(basePool * (0.3 + Math.random() * 0.4));
  const downPool = basePool - upPool;
  
  // Determine result based on random price movement for completed rounds
  const priceChange = (Math.random() - 0.5) * 0.0001;
  const startPrice = simulatedPrice - priceChange;
  const endPrice = isActive ? null : simulatedPrice + priceChange;
  const result = isActive ? null : (priceChange > 0 ? 'UP' : 'DOWN') as BetDirection;
  
  return {
    id,
    startTick,
    endTick,
    startPrice: startPrice * 1e8, // Convert to integer representation
    endPrice: endPrice ? endPrice * 1e8 : null,
    result,
    totalPool: basePool,
    upPool,
    downPool,
    status: isActive ? 'active' : tick >= endTick ? 'completed' : 'pending',
  };
}

// Contract interaction functions
export async function getLiveTick(): Promise<Tick> {
  try {
    const tick = await qubicConnector.getCurrentTick();
    if (tick > 0) {
      return {
        tick,
        timestamp: Date.now(),
      };
    }
    throw new Error('Invalid tick from connector');
  } catch (error) {
    // Fallback to RPC call
    try {
      const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/tick-info`);
      if (response.ok) {
        const data = await response.json();
        return {
          tick: data.tickInfo?.tick ?? data.tick ?? 0,
          timestamp: Date.now(),
        };
      }
    } catch {
      // Continue to simulation fallback
    }
    
    // Simulation fallback - generate a realistic tick based on time
    const baseTime = new Date('2024-01-01').getTime();
    const elapsed = Date.now() - baseTime;
    const simulatedTick = Math.floor(elapsed / QUBIC_CONFIG.tickDuration);
    return {
      tick: simulatedTick,
      timestamp: Date.now(),
    };
  }
}

export async function getCurrentPrice(): Promise<PriceData> {
  // Simulate price with small random fluctuations
  if (QUBIC_CONFIG.simulationMode) {
    // Add small random price movement
    simulatedPrice += (Math.random() - 0.5) * 0.000001;
    simulatedPrice = Math.max(0.00001, simulatedPrice); // Keep positive
    
    return {
      price: simulatedPrice * 1e8, // Convert to integer representation (like satoshis)
      change24h: (Math.random() - 0.5) * 10, // -5% to +5%
      timestamp: Date.now(),
    };
  }
  
  try {
    // Try to get price from tick-info (this endpoint does exist)
    const tickResponse = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/tick-info`);
    if (tickResponse.ok) {
      const tickData = await tickResponse.json();
      return {
        price: tickData.price ?? simulatedPrice * 1e8,
        change24h: 0,
        timestamp: Date.now(),
      };
    }
    throw new Error('Failed to fetch price');
  } catch {
    // Fallback to simulated price
    return {
      price: simulatedPrice * 1e8,
      change24h: 0,
      timestamp: Date.now(),
    };
  }
}

export async function getCurrentRound(): Promise<Round> {
  const tick = await getLiveTick();
  const currentRoundId = Math.floor(tick.tick / QUBIC_CONFIG.roundDuration);
  
  if (QUBIC_CONFIG.simulationMode) {
    simulatedRoundId = currentRoundId;
    return generateSimulatedRound(currentRoundId, tick.tick, true);
  }
  
  // If not in simulation mode, try real API (but it won't work since SC doesn't exist)
  return {
    id: currentRoundId,
    startTick: currentRoundId * QUBIC_CONFIG.roundDuration,
    endTick: (currentRoundId + 1) * QUBIC_CONFIG.roundDuration,
    startPrice: 0,
    endPrice: null,
    result: null,
    totalPool: 0,
    upPool: 0,
    downPool: 0,
    status: 'active',
  };
}

export async function getRound(id: number): Promise<Round> {
  const tick = await getLiveTick();
  
  if (QUBIC_CONFIG.simulationMode) {
    const currentRoundId = Math.floor(tick.tick / QUBIC_CONFIG.roundDuration);
    const isActive = id === currentRoundId;
    return generateSimulatedRound(id, tick.tick, isActive);
  }
  
  return {
    id,
    startTick: id * QUBIC_CONFIG.roundDuration,
    endTick: (id + 1) * QUBIC_CONFIG.roundDuration,
    startPrice: 0,
    endPrice: null,
    result: null,
    totalPool: 0,
    upPool: 0,
    downPool: 0,
    status: 'pending',
  };
}

export async function getRoundsHistory(limit = 20): Promise<Round[]> {
  const tick = await getLiveTick();
  const currentRoundId = Math.floor(tick.tick / QUBIC_CONFIG.roundDuration);
  
  if (QUBIC_CONFIG.simulationMode) {
    // Generate simulated history
    const rounds: Round[] = [];
    for (let i = 0; i < limit; i++) {
      const roundId = currentRoundId - i - 1;
      if (roundId < 0) break;
      rounds.push(generateSimulatedRound(roundId, tick.tick, false));
    }
    return rounds;
  }
  
  return [];
}

// Simulated bets storage for demo
const simulatedBets: Map<string, Bet[]> = new Map();

export async function placeBet(direction: BetDirection, amount: number): Promise<{ txHash: string; bet: Bet }> {
  if (!qubicConnector.isConnected()) {
    throw new Error('Wallet not connected');
  }

  const address = qubicConnector.getAddress();
  if (!address) {
    throw new Error('No wallet address');
  }

  if (amount < QUBIC_CONFIG.minBet || amount > QUBIC_CONFIG.maxBet) {
    throw new Error(`Bet amount must be between ${QUBIC_CONFIG.minBet} and ${QUBIC_CONFIG.maxBet}`);
  }

  const balance = await qubicConnector.getBalance();
  if (amount > balance) {
    throw new Error('Insufficient balance');
  }

  // Get current round
  const currentRound = await getCurrentRound();
  
  if (QUBIC_CONFIG.simulationMode) {
    // Simulate placing a bet
    const txHash = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const bet: Bet = {
      id: txHash,
      roundId: currentRound.id,
      address,
      direction,
      amount,
      timestamp: Date.now(),
      claimed: false,
      won: null,
      payout: null,
    };
    
    // Store in simulated storage
    const userBets = simulatedBets.get(address) ?? [];
    userBets.push(bet);
    simulatedBets.set(address, userBets);
    
    return { txHash, bet };
  }
  
  // Build input data for bet
  const inputData = encodeBetInput(direction, currentRound.id);
  
  // Sign and send transaction
  const result = await qubicConnector.signAndSendTx({
    contractId: QUBIC_CONFIG.contractId,
    inputType: 1, // BET input type
    inputData,
    amount,
  });

  if (!result.success) {
    throw new Error(result.message ?? 'Transaction failed');
  }

  const bet: Bet = {
    id: result.txHash,
    roundId: currentRound.id,
    address,
    direction,
    amount,
    timestamp: Date.now(),
    claimed: false,
    won: null,
    payout: null,
  };

  return {
    txHash: result.txHash,
    bet,
  };
}

export async function getUserBets(address: string): Promise<Bet[]> {
  if (QUBIC_CONFIG.simulationMode) {
    // Return simulated bets with updated status
    const bets = simulatedBets.get(address) ?? [];
    const tick = await getLiveTick();
    const currentRoundId = Math.floor(tick.tick / QUBIC_CONFIG.roundDuration);
    
    return bets.map(bet => {
      if (bet.roundId < currentRoundId && bet.won === null) {
        // Simulate random outcome for completed rounds
        const won = Math.random() > 0.5;
        return {
          ...bet,
          won,
          payout: won ? bet.amount * 1.9 : 0,
        };
      }
      return bet;
    });
  }
  
  return [];
}

export async function getUserClaimable(address: string): Promise<ClaimableWinnings[]> {
  if (QUBIC_CONFIG.simulationMode) {
    const bets = await getUserBets(address);
    return bets
      .filter(bet => bet.won === true && !bet.claimed)
      .map(bet => ({
        roundId: bet.roundId,
        amount: bet.payout ?? 0,
        direction: bet.direction,
      }));
  }
  
  return [];
}

export async function claimWinnings(roundId: number): Promise<{ txHash: string; amount: number }> {
  if (!qubicConnector.isConnected()) {
    throw new Error('Wallet not connected');
  }
  
  const address = qubicConnector.getAddress();
  if (!address) {
    throw new Error('No wallet address');
  }

  if (QUBIC_CONFIG.simulationMode) {
    // Simulate claim
    const bets = simulatedBets.get(address) ?? [];
    const betIndex = bets.findIndex(b => b.roundId === roundId && b.won === true && !b.claimed);
    
    if (betIndex === -1) {
      throw new Error('No claimable winnings for this round');
    }
    
    const bet = bets[betIndex];
    bets[betIndex] = { ...bet, claimed: true };
    simulatedBets.set(address, bets);
    
    return {
      txHash: `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: bet.payout ?? 0,
    };
  }

  // Build input data for claim
  const inputData = encodeClaimInput(roundId);
  
  // Sign and send transaction
  const result = await qubicConnector.signAndSendTx({
    contractId: QUBIC_CONFIG.contractId,
    inputType: 2, // CLAIM input type
    inputData,
    amount: 0,
  });

  if (!result.success) {
    throw new Error(result.message ?? 'Claim failed');
  }

  return {
    txHash: result.txHash,
    amount: 0, // Amount will be determined by contract
  };
}

// Helper to calculate expected payout
export function calculatePayout(amount: number, direction: BetDirection, round: Round): number {
  const pool = direction === 'UP' ? round.upPool : round.downPool;
  const oppositePool = direction === 'UP' ? round.downPool : round.upPool;
  const totalAfterFee = (pool + oppositePool) * (1 - QUBIC_CONFIG.houseFee);
  const share = amount / (pool + amount);
  return totalAfterFee * share;
}

// Helper functions to map API data to our types
function mapRoundData(data: Record<string, unknown>): Round {
  return {
    id: Number(data.id ?? data.roundId ?? 0),
    startTick: Number(data.startTick ?? 0),
    endTick: Number(data.endTick ?? 0),
    startPrice: Number(data.startPrice ?? 0),
    endPrice: data.endPrice != null ? Number(data.endPrice) : null,
    result: (data.result as BetDirection) ?? null,
    totalPool: Number(data.totalPool ?? 0),
    upPool: Number(data.upPool ?? 0),
    downPool: Number(data.downPool ?? 0),
    status: (data.status as Round['status']) ?? 'pending',
  };
}

function mapBetData(data: Record<string, unknown>): Bet {
  return {
    id: String(data.id ?? data.betId ?? ''),
    roundId: Number(data.roundId ?? 0),
    address: String(data.address ?? ''),
    direction: (data.direction as BetDirection) ?? 'UP',
    amount: Number(data.amount ?? 0),
    timestamp: Number(data.timestamp ?? Date.now()),
    claimed: Boolean(data.claimed),
    won: data.won != null ? Boolean(data.won) : null,
    payout: data.payout != null ? Number(data.payout) : null,
  };
}

function mapClaimableData(data: Record<string, unknown>): ClaimableWinnings {
  return {
    roundId: Number(data.roundId ?? 0),
    amount: Number(data.amount ?? 0),
    direction: (data.direction as BetDirection) ?? 'UP',
  };
}

// Encode bet input for contract
function encodeBetInput(direction: BetDirection, roundId: number): Uint8Array {
  const buffer = new ArrayBuffer(5);
  const view = new DataView(buffer);
  view.setUint8(0, direction === 'UP' ? 1 : 0);
  view.setUint32(1, roundId, true); // little-endian
  return new Uint8Array(buffer);
}

// Encode claim input for contract
function encodeClaimInput(roundId: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, roundId, true); // little-endian
  return new Uint8Array(buffer);
}
