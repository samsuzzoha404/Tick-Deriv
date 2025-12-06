// Use proxy in development to avoid CORS issues
const isDev = import.meta.env.DEV;

export const QUBIC_CONFIG = {
  network: 'mainnet' as const,
  // Use Vite proxy in development, direct URL in production
  rpcUrl: isDev ? '/api/qubic' : 'https://rpc.qubic.org',
  tickDuration: 1000, // ms per tick
  roundDuration: 20, // ticks per round
  houseFee: 0.02, // 2%
  minBet: 1,
  maxBet: 10000,
  contractId: 1, // TickDeriv contract ID
  // Simulation mode enabled for testing UI/wallet (backend contract not deployed yet)
  // Set to false when TickDeriv smart contract is deployed on Qubic
  simulationMode: true,
};

export const REFETCH_INTERVALS = {
  tick: 1000,
  price: 2000,
  rounds: 5000,
  balance: 2000, // Poll balance every 2 seconds
};

export const ROUTES = {
  dashboard: '/',
  bet: '/bet',
  history: '/history',
  wallet: '/wallet',
  settings: '/settings',
};

