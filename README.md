# 🛡️ ClawSearch DarkDesk

> AI-Brokered OTC Dark Pool for Confidential RWA Trading

[![Built on iExec Nox](https://img.shields.io/badge/iExec-Nox_Protocol-06b6d4.svg)](https://nox.iex.ec/)
[![ChainGPT](https://img.shields.io/badge/AI-ChainGPT-a855f7.svg)](https://chaingpt.org/)
[![Arbitrum Sepolia](https://img.shields.io/badge/Chain-Arbitrum_Sepolia-2d374b.svg)](https://sepolia.arbiscan.io/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)

---

## 🎯 The Problem

When institutional players trade large blocks of tokenized Real World Assets (RWAs) — such as $5M of tokenized T-Bills — public blockchains broadcast every detail. MEV bots front-run, copy-traders pile on, and slippage costs 2–5% of trade value. In traditional finance, **dark pools** solve this. On-chain, there is no privacy layer for confidential OTC settlement.

**Result**: The $15T RWA tokenization wave stays stuck because institutions can't trade without broadcasting their intent.

## 💡 The Solution

**ClawSearch DarkDesk** is an AI-brokered OTC dark pool built on iExec Confidential Tokens and the Nox Protocol:

1. **Off-Chain Negotiation** — An AI broker (powered by ChainGPT's Web3 LLM) negotiates trade terms using natural language, pulling **live market data** from Alpaca Markets API — zero mocked data.
2. **Confidential Wrapping** — Traders wrap standard ERC-20 tokens (USDC, WETH) into iExec Confidential Tokens. Balances become cryptographically hidden on-chain.
3. **Atomic Settlement** — A smart escrow contract on Arbitrum Sepolia atomically swaps confidential tokens. The settlement is on-chain — but **Arbiscan shows $0.00 and encrypted gibberish**.

**Arbiscan sees nothing. The market doesn't move.**

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **AI Trade Negotiator** | ChainGPT Web3 LLM-powered chat for natural-language OTC negotiation |
| **Live RWA Price Oracle** | Alpaca API for real-time T-Bill yields and stock prices — zero mocked data |
| **Confidential Wrap/Unwrap** | ERC-20 ↔ cToken conversion via iExec Nox Protocol |
| **Confidential Escrow** | Atomic swap contract holding both parties' cTokens |
| **Split-Screen Verifier** | Side-by-side: Arbiscan (encrypted) vs. DarkDesk (real balances) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    ClawSearch DarkDesk               │
├─────────────┬──────────────┬────────────────────────┤
│  AI Chat    │   Escrow     │   Market Data          │
│  (ChainGPT) │  (cTokens)  │   (Alpaca API)         │
├─────────────┴──────────────┴────────────────────────┤
│              Next.js 16 + React 19                   │
├─────────────────────────────────────────────────────┤
│     wagmi v2 + viem + RainbowKit (Wallet)           │
├─────────────────────────────────────────────────────┤
│  iExec Nox Protocol (TEE Confidential Tokens)       │
├─────────────────────────────────────────────────────┤
│         Arbitrum Sepolia (Chain ID: 421614)          │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.9.0 (see `.nvmrc`)
- **npm** ≥ 9

### Installation

```bash
git clone https://github.com/edycutjong/clawsearch-darkdesk.git
cd clawsearch-darkdesk && npm install
cp .env.example .env.local   # Add your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Source |
|---|---|
| `CHAINGPT_API_KEY` | Contact @vladnazarxyz on Telegram |
| `ALPACA_API_KEY` / `ALPACA_API_SECRET` | [Alpaca Markets](https://app.alpaca.markets/) (free paper trading) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | [WalletConnect Cloud](https://cloud.walletconnect.com/) |
| `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS` | After deploying `DarkDeskEscrow.sol` to Sepolia |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS v4 |
| **Wallet** | wagmi v2, viem, RainbowKit |
| **AI** | ChainGPT Web3 LLM API |
| **Market Data** | Alpaca Markets API (live, zero mocks) |
| **Privacy** | iExec Nox Protocol, Confidential Tokens |
| **Chain** | Arbitrum Sepolia (421614) |
| **Contracts** | Solidity 0.8.20, Hardhat |

---

## 📁 Project Structure

```
clawsearch-darkdesk/
├── src/
│   ├── app/
│   │   ├── api/chat/        # ChainGPT proxy route
│   │   ├── api/price/       # Alpaca market data route
│   │   ├── trade/           # Trading desk page
│   │   ├── globals.css      # Design system
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── AIChat.tsx       # AI negotiation interface
│   │   ├── DarkDeskEscrow.tsx # Escrow lifecycle panel
│   │   ├── PriceOracle.tsx  # Live RWA price ticker
│   │   ├── SplitScreenVerifier.tsx # Arbiscan vs DarkDesk
│   │   └── Header.tsx       # Navigation
│   └── lib/
│       ├── chaingpt.ts      # ChainGPT client
│       ├── alpaca.ts        # Alpaca market data client
│       └── wagmi-config.ts  # Wallet configuration
├── contracts/
│   └── DarkDeskEscrow.sol   # Atomic swap escrow
├── feedback.md              # iExec tools feedback (required)
└── package.json
```

---

## 🎨 Demo Flow

1. **Landing Page** — Dark premium hero with feature cards
2. **Connect Wallet** — RainbowKit on Arbitrum Sepolia
3. **Wrap USDC → cUSDC** — Confidential Token wrapping
4. **AI Negotiation** — ChainGPT proposes fair price with live Alpaca data
5. **Create Escrow** — Atomic swap with countdown timer
6. **Split-Screen Reveal** — Arbiscan ($0.00, encrypted) vs. DarkDesk (100,000 cUSDC @ 4.72% APY)

---

## 🎛️ Vibe Coding

This project was built with AI-assisted development throughout:
- ChainGPT Smart Contract Generator for initial Solidity boilerplate
- ChainGPT Auditor for pre-deployment security review
- All AI-assisted steps documented with screenshots

---

## 🏆 Hackathon

**Competition**: [iExec Vibe Coding Challenge](https://dorahacks.io/hackathon/vibe-coding-iexec)
**Track**: Confidential RWA & DeFi
**Prize Pool**: $1,500 USD (RLC tokens)

### Confidential Token Utility

| Utility | How |
|---|---|
| **Private Payments** | OTC settlement amounts hidden from public blockchain |
| **Access Control** | Only trade participants with TEE-decrypted keys can view balances |
| **In-App Currency** | cUSDC is the primary settlement token |
| **Rewards** | Successful trades generate "DarkDesk Verified" receipt |

---

## 📄 License

MIT © 2026 [Edy Cu](https://github.com/edycutjong)

## Built for [iExec Vibe Coding Challenge](https://dorahacks.io/hackathon/vibe-coding-iexec)

By: [@edycutjong](https://x.com/edycutjong) | Tags: @iEx_ec @Chain_GPT
