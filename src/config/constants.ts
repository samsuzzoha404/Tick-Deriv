export const QUBIC_CONFIG = {
  network: 'testnet',
  rpcUrl: 'https://rpc.qubic.org',
  tickDuration: 1000, // ms per tick
  roundDuration: 20, // ticks per round
  houseFee: 0.02, // 2%
  minBet: 1,
  maxBet: 10000,
};

export const DEMO_MODE = {
  enabled: true,
  mockBalance: 10000,
  mockAddress: 'QUBIC...DEMO1234',
};

export const REFETCH_INTERVALS = {
  tick: 1000,
  price: 2000,
  rounds: 5000,
  balance: 10000,
};

export const ROUTES = {
  dashboard: '/',
  bet: '/bet',
  history: '/history',
  wallet: '/wallet',
  settings: '/settings',
};
