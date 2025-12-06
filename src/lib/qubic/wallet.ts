import { WalletState } from '@/types';
import { DEMO_MODE } from '@/config/constants';

class QubicWallet {
  private state: WalletState = {
    connected: false,
    address: null,
    balance: 0,
  };

  private listeners: Set<(state: WalletState) => void> = new Set();

  async connect(): Promise<WalletState> {
    // In demo mode, simulate wallet connection
    if (DEMO_MODE.enabled) {
      await this.simulateDelay(800);
      this.state = {
        connected: true,
        address: DEMO_MODE.mockAddress,
        balance: DEMO_MODE.mockBalance,
      };
      this.notifyListeners();
      return this.state;
    }

    // Real Qubic wallet connection would go here
    // Using @qubic-lib/qubic-ts-library
    try {
      // const qubic = new QubicLib();
      // const wallet = await qubic.connect();
      // this.state = { connected: true, address: wallet.address, balance: wallet.balance };
      throw new Error('Real wallet not implemented - use demo mode');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.simulateDelay(300);
    this.state = {
      connected: false,
      address: null,
      balance: 0,
    };
    this.notifyListeners();
  }

  getState(): WalletState {
    return { ...this.state };
  }

  async getBalance(): Promise<number> {
    if (!this.state.connected) return 0;
    
    if (DEMO_MODE.enabled) {
      return this.state.balance;
    }

    // Real balance fetch
    return this.state.balance;
  }

  async signTransaction(txData: unknown): Promise<string> {
    if (!this.state.connected) {
      throw new Error('Wallet not connected');
    }

    if (DEMO_MODE.enabled) {
      await this.simulateDelay(500);
      return `0x${Math.random().toString(16).slice(2)}`;
    }

    // Real transaction signing
    throw new Error('Real signing not implemented');
  }

  subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Demo mode helper - deduct balance
  deductBalance(amount: number): void {
    if (DEMO_MODE.enabled && this.state.connected) {
      this.state.balance = Math.max(0, this.state.balance - amount);
      this.notifyListeners();
    }
  }

  // Demo mode helper - add balance
  addBalance(amount: number): void {
    if (DEMO_MODE.enabled && this.state.connected) {
      this.state.balance += amount;
      this.notifyListeners();
    }
  }
}

export const qubicWallet = new QubicWallet();
