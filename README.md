# 🎲 Tick-Deriv

A decentralized binary options trading platform built on the Qubic blockchain. Place directional bets on tick-based price movements with transparent, on-chain execution.

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://tick-deriv.vercel.app/)
[![Built with Qubic](https://img.shields.io/badge/blockchain-Qubic-blue)](https://qubic.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌐 Live Demo

**[https://tick-deriv.vercel.app/](https://tick-deriv.vercel.app/)**

## ✨ Features

- **🎯 Binary Options Trading**: Place UP or DOWN bets on tick-based price movements
- **⚡ Real-Time Price Feeds**: Live tick data from Qubic RPC
- **💰 Transparent Payouts**: 2% house fee with instant settlement
- **🔐 Wallet Integration**: Secure connection with Qubic wallets
- **📊 Round-Based Trading**: 30-tick rounds (30 seconds) with countdown timers
- **📈 Historical Data**: View past rounds and your betting history
- **💎 Modern UI**: Glass-morphism design with dark/light theme support
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **🔄 Live Updates**: Real-time round status and balance updates

## 🛠️ Tech Stack

### Frontend
- **[React 18](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool & dev server
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - UI component library
- **[React Query](https://tanstack.com/query)** - Data fetching & caching
- **[React Router](https://reactrouter.com/)** - Client-side routing

### Blockchain
- **[Qubic](https://qubic.org/)** - Layer 1 blockchain
- **[@qubic-lib/qubic-ts-library](https://www.npmjs.com/package/@qubic-lib/qubic-ts-library)** - Qubic TypeScript SDK

### Design & UX
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide Icons](https://lucide.dev/)** - Icon library
- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[Recharts](https://recharts.org/)** - Data visualization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samsuzzoha404/Tick-Deriv.git
   cd Tick-Deriv
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# or
bun run build
```

Preview production build:
```bash
npm run preview
# or
bun preview
```

## 📁 Project Structure

```
tick-deriv/
├── src/
│   ├── components/          # React components
│   │   ├── bet/            # Betting-related components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # shadcn/ui components
│   ├── config/             # Configuration files
│   ├── contexts/           # React contexts (Theme, Wallet)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   └── qubic/          # Qubic blockchain integration
│   ├── pages/              # Page components
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── ...config files
```

## 🎮 How to Use

### 1. Connect Your Wallet
- Click the **"Connect Wallet"** button in the header
- Enter your Qubic wallet seed (demo mode available)

### 2. Place a Bet
- Navigate to the **"Place Bet"** page
- Choose **UP** or **DOWN** direction
- Enter bet amount (min: 1, max: 10,000 QUBIC)
- Review payout calculation (98% return on win)
- Click **"Place Bet"** to submit

### 3. Track Your Bets
- Monitor active rounds on the **Dashboard**
- View countdown timer and current tick
- Check **"Rounds History"** for past results
- View your betting history and balance

## ⚙️ Configuration

Key configuration in `src/config/constants.ts`:

```typescript
export const QUBIC_CONFIG = {
  network: 'mainnet',
  rpcUrl: 'https://rpc.qubic.org',
  tickDuration: 1000,        // 1 second per tick
  roundDuration: 30,         // 30 ticks per round
  houseFee: 0.02,            // 2% fee
  minBet: 1,                 // Minimum bet
  maxBet: 10000,             // Maximum bet
  simulationMode: true,      // Demo mode (no real transactions)
};
```

## 🔒 Simulation Mode

Currently running in **simulation mode** for testing:
- No real blockchain transactions
- Simulated price feeds and rounds
- Safe environment to test features
- Will be disabled when smart contract is deployed

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Qubic](https://qubic.org/) - For the blockchain infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - For the beautiful UI components
- [Vercel](https://vercel.com/) - For hosting and deployment

## 📧 Contact

**Sam Suzzoha** - [@samsuzzoha404](https://github.com/samsuzzoha404)

Project Link: [https://github.com/samsuzzoha404/Tick-Deriv](https://github.com/samsuzzoha404/Tick-Deriv)

---

<div align="center">
  <strong>Built with ❤️ on Qubic</strong>
</div>
