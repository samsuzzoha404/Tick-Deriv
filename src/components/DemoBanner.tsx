import { Zap, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QUBIC_CONFIG } from '@/config/constants';
import { useWallet } from '@/hooks/useWallet';

export function DemoBanner() {
  const { isDemoMode } = useWallet();

  if (!QUBIC_CONFIG.simulationMode || !isDemoMode) {
    return null;
  }

  return (
    <Alert className="border-primary/20 bg-primary/5 mb-4">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong className="text-primary">Demo Mode Active:</strong> You're using a demo wallet with simulated funds. 
          All bets and transactions are simulated. Your demo state is saved in your browser.
        </AlertDescription>
      </div>
    </Alert>
  );
}
