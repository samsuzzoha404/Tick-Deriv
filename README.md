# Tick Deriv

## Project info

A decentralized high-frequency binary options trading platform built on Qubic blockchain.

## 🎮 Demo Mode

The application runs in **full demo simulation mode** by default, allowing you to explore all features without needing a real Qubic wallet or funds.

### Demo Features

- **Instant Demo Wallet**: Connect with one click to get 10,000 QU demo balance
- **Realistic Price Simulation**: Live price updates with smooth, realistic volatility
- **Functional Betting**: Place bets and see real-time win/loss calculations
- **Persistent State**: Your demo wallet balance and bet history are saved in your browser
- **30-Second Rounds**: Fast-paced rounds for quick testing
- **Automatic Payouts**: Win 1.9x your bet amount on correct predictions

### Using Demo Mode

1. Click "Connect Wallet" button
2. Select "Demo Wallet" tab
3. Click "Connect Demo Wallet" to instantly get started
4. You'll receive 10,000 QU demo balance
5. Place bets on UP or DOWN price movements
6. Watch rounds complete and claim your winnings!

Your demo wallet state persists across browser sessions using localStorage.

📖 **[Read the Quick Start Guide](./QUICK_START.md)** for a detailed walkthrough!

### Real Wallet Support

You can also connect with a real Qubic wallet by entering your seed phrase in the "Real Wallet" tab. However, the smart contract is not yet deployed, so only simulated transactions will work.

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get started in under 1 minute
- **[Demo Implementation Details](./DEMO_IMPLEMENTATION.md)** - Technical documentation

## How can I edit this code?

You can work locally using your own IDE by cloning this repo and pushing changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Build the project using `npm run build` and deploy the `dist` folder to your preferred hosting service.
