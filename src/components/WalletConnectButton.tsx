import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useWallet } from '@/hooks/useWallet';
import { formatAddress } from '@/lib/utils';
import { Wallet, LogOut, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletConnectButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showBalance?: boolean;
}

export function WalletConnectButton({
  className,
  variant = 'default',
  size = 'default',
  showBalance = false,
}: WalletConnectButtonProps) {
  const { connected, address, balance, connect, disconnect, isConnecting, error } = useWallet();
  const [seed, setSeed] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!seed.trim()) {
      setConnectError('Please enter your seed phrase');
      return;
    }

    if (seed.length < 55) {
      setConnectError('Seed must be at least 55 characters');
      return;
    }

    setConnectError(null);
    try {
      await connect(seed);
      setSeed('');
      setDialogOpen(false);
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSeed('');
      setConnectError(null);
    }
  };

  if (connected && address) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {showBalance && (
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground">Balance</div>
            <div className="text-sm font-mono font-medium">{balance.toLocaleString()} QU</div>
          </div>
        )}
        <Button
          variant="outline"
          size={size}
          onClick={handleDisconnect}
          className="font-mono"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {formatAddress(address, 4)}
          <LogOut className="h-4 w-4 ml-2 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isConnecting}
          className={cn(
            variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
            className
          )}
        >
          {isConnecting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Enter your Qubic seed phrase to connect your wallet. Your seed will be stored securely in your browser session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter your 55+ character seed phrase"
              value={seed}
              onChange={(e) => {
                setSeed(e.target.value);
                setConnectError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isConnecting) {
                  handleConnect();
                }
              }}
              disabled={isConnecting}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Your seed phrase is never sent to any server. It stays in your browser.
            </p>
          </div>

          {(connectError || error) && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{connectError || error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleDialogOpenChange(false)}
            disabled={isConnecting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isConnecting || !seed.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isConnecting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Connecting...
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
