import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Globe, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <MainLayout>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Appearance */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <h2 className="text-lg font-semibold">Appearance</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-base font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </GlassCard>

          {/* Network */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Network</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-up animate-pulse" />
                  <div>
                    <div className="font-medium">Qubic Testnet</div>
                    <div className="text-sm text-muted-foreground">Connected</div>
                  </div>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Active
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                TickDeriv currently operates on Qubic Testnet. Mainnet support coming soon.
              </p>
            </div>
          </GlassCard>

          {/* Notifications */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="round-alerts" className="text-base font-medium">
                    Round Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when rounds end
                  </p>
                </div>
                <Switch id="round-alerts" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="win-alerts" className="text-base font-medium">
                    Win Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Celebrate when you win
                  </p>
                </div>
                <Switch id="win-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound" className="text-base font-medium">
                    Sound Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for actions
                  </p>
                </div>
                <Switch id="sound" />
              </div>
            </div>
          </GlassCard>

          {/* Security */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="confirm-bets" className="text-base font-medium">
                    Confirm Large Bets
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require confirmation for bets over 500 QU
                  </p>
                </div>
                <Switch id="confirm-bets" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-disconnect" className="text-base font-medium">
                    Auto-Disconnect
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Disconnect wallet after 30 minutes of inactivity
                  </p>
                </div>
                <Switch id="auto-disconnect" />
              </div>
            </div>
          </GlassCard>

          {/* Language */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Language</h2>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <span className="text-xl">🇺🇸</span>
                <div>
                  <div className="font-medium">English</div>
                  <div className="text-sm text-muted-foreground">United States</div>
                </div>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Selected
              </span>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              More languages coming soon.
            </p>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}
