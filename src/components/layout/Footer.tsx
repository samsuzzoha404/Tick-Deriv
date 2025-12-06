import { Target, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Target className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">
              Tick<span className="text-primary">Deriv</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
              Qubic
              <ExternalLink className="h-3 w-3" />
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Support
            </a>
          </div>

          {/* Network badge */}
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-up animate-pulse" />
            <span className="text-muted-foreground">Qubic Testnet</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TickDeriv. Decentralized binary options on Qubic.
        </div>
      </div>
    </footer>
  );
}
