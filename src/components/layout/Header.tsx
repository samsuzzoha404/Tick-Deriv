import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useWallet } from '@/hooks/useWallet';
import { useTheme } from '@/contexts/ThemeContext';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { Button } from '@/components/ui/button';
import { formatAddress, formatNumber } from '@/lib/utils';
import { 
  Wallet, 
  Moon, 
  Sun, 
  Menu, 
  X,
  LayoutDashboard,
  Target,
  History,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '@/config/constants';

const navItems = [
  { label: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Place Bet', path: ROUTES.bet, icon: Target },
  { label: 'History', path: ROUTES.history, icon: History },
  { label: 'Wallet', path: ROUTES.wallet, icon: Wallet },
  { label: 'Settings', path: ROUTES.settings, icon: Settings },
];

export function Header() {
  const location = useLocation();
  const { connected, address, balance, connect, disconnect, isConnecting } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Tick<span className="text-primary">Deriv</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Wallet */}
          {connected ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <div className="text-xs text-muted-foreground">Balance</div>
                <div className="text-sm font-mono font-medium">{formatNumber(balance)} QU</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="font-mono"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {formatAddress(address || '', 4)}
              </Button>
            </div>
          ) : (
            <WalletConnectButton size="sm" />
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
