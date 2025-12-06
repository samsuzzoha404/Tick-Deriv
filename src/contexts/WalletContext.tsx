import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { qubicConnector, QubicConnector, TransactionResult, ContractTxParams } from '@/lib/qubic/connector';
import { WalletState } from '@/types';

const STORAGE_KEY = 'qubic_wallet_connected';
const SEED_STORAGE_KEY = 'qubic_wallet_seed';

export interface WalletContextValue extends WalletState {
  isConnecting: boolean;
  error: string | null;
  connectWallet: (seed: string) => Promise<void>;
  disconnectWallet: () => void;
  getAddress: () => string | null;
  getBalance: () => Promise<number>;
  signAndSendTx: (params: ContractTxParams) => Promise<TransactionResult>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [state, setState] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAutoConnected = useRef(false);

  const connectWalletInternal = useCallback(async (seed: string): Promise<void> => {
    if (!QubicConnector.isValidSeed(seed)) {
      throw new Error('Invalid seed: must be at least 55 characters');
    }

    setIsConnecting(true);
    setError(null);

    try {
      const walletInfo = await qubicConnector.connect(seed);
      const balance = await qubicConnector.getBalance();

      setState({
        connected: true,
        address: walletInfo.address,
        balance,
      });

      localStorage.setItem(STORAGE_KEY, 'true');
      sessionStorage.setItem(SEED_STORAGE_KEY, seed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      throw new Error(message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Auto-reconnect on mount if previously connected
  useEffect(() => {
    if (hasAutoConnected.current) return;
    hasAutoConnected.current = true;

    const wasConnected = localStorage.getItem(STORAGE_KEY) === 'true';
    const storedSeed = sessionStorage.getItem(SEED_STORAGE_KEY);
    
    if (wasConnected && storedSeed) {
      connectWalletInternal(storedSeed).catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(SEED_STORAGE_KEY);
      });
    }
  }, [connectWalletInternal]);

  const connectWallet = useCallback(async (seed: string): Promise<void> => {
    await connectWalletInternal(seed);
  }, [connectWalletInternal]);

  const disconnectWallet = useCallback((): void => {
    qubicConnector.disconnect();
    
    setState({
      connected: false,
      address: null,
      balance: 0,
    });

    // Clear persisted state
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SEED_STORAGE_KEY);
    setError(null);
  }, []);

  const getAddress = useCallback((): string | null => {
    return qubicConnector.getAddress();
  }, []);

  const getBalance = useCallback(async (): Promise<number> => {
    if (!qubicConnector.isConnected()) {
      return 0;
    }

    try {
      const balance = await qubicConnector.getBalance();
      setState(prev => ({ ...prev, balance }));
      return balance;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch balance';
      setError(message);
      return state.balance;
    }
  }, [state.balance]);

  const signAndSendTx = useCallback(async (params: ContractTxParams): Promise<TransactionResult> => {
    if (!qubicConnector.isConnected()) {
      return {
        txHash: '',
        success: false,
        message: 'Wallet not connected',
      };
    }

    try {
      const result = await qubicConnector.signAndSendTx(params);
      
      // Refresh balance after transaction
      if (result.success) {
        await getBalance();
      }
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      return {
        txHash: '',
        success: false,
        message,
      };
    }
  }, [getBalance]);

  const refreshBalance = useCallback(async (): Promise<void> => {
    if (qubicConnector.isConnected()) {
      await getBalance();
    }
  }, [getBalance]);

  const value: WalletContextValue = {
    ...state,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    getAddress,
    getBalance,
    signAndSendTx,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Export context for useWalletContext hook only
export { WalletContext };
export type { ContractTxParams, TransactionResult };
