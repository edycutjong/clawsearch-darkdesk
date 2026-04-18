<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🛡️ ClawSearch DarkDesk — Agent Instructions

## Project
AI-Brokered OTC Dark Pool for Confidential RWA Trading. ChainGPT negotiates institutional OTC trades off-chain, matches counterparties via live Alpaca market data, and settles on-chain using iExec Confidential Tokens. Arbiscan shows encrypted gibberish; DarkDesk shows the real trade.

## Hackathon
**DoraHacks iExec Vibe Coding Challenge 2026** — Demonstrating Confidential Token utility for institutional RWA trading.

## Structure
- `src/app/` — Next.js 16 App Router pages (landing, trade, escrow, API routes)
- `src/components/` — React 19 components (AIChat, PriceOracle, SplitScreenVerifier, DarkDeskEscrow)
- `src/lib/` — Shared clients (chaingpt, alpaca, wagmi-config, constants)
- `contracts/` — Solidity smart contracts (DarkDeskEscrow.sol)
- `feedback.md` — Required iExec tools feedback (DQ if missing)

## Tech Stack
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

## Key Rules
- **Frontend** = ESM (`import`), Next.js 16, React 19, Tailwind v4
- **Zero mocked data** — All market data from Alpaca API (live)
- **Colors** = Cyan (#06b6d4) for iExec/TEE, Purple (#a855f7) for ChainGPT AI, Red (#ef4444) for public Arbiscan view, Green (#22c55e) for private DarkDesk view
- **Aesthetic** = Bloomberg Terminal / Dark Pool, dark mode only, glassmorphism cards
- **Typography** = Mono (JetBrains Mono / system mono) for terminal feel
- **DQ Items** = feedback.md in root, deploy on Sepolia Arbitrum, demo video ≤ 4 min, X/Twitter post tagging @iEx_ec + @Chain_GPT
