![YouTube Video](https://www.youtube.com/watch?v=2elHcUeJ_DM)

## 💡 Inspiration

When institutions trade large blocks of tokenized Real World Assets (RWAs) — say $5M of tokenized T-Bills — public blockchains broadcast every detail. MEV bots front-run, copy-traders pile on, and slippage costs **2–5%** of trade value.

In traditional finance, **dark pools** solve this. They account for ~40% of all US equity volume. But on-chain? There is no privacy layer for confidential OTC settlement.

**The $15T RWA tokenization wave is stuck because institutions can't trade without broadcasting their intent.**

We asked: *what if an AI agent could broker institutional OTC trades inside a Trusted Execution Environment, so the blockchain only ever sees encrypted gibberish?*

## 🔍 What it does

**ClawSearch DarkDesk** is the first AI-brokered OTC dark pool for confidential RWA trading. It combines three pillars:

### 1. 🤖 AI Trade Negotiator

A ChainGPT-powered Web3 LLM agent that understands natural language like *"I want to sell $2M of tokenized T-Bills at current yield"*. It evaluates live market data, suggests fair pricing, and matches counterparties — all conversationally.

### 2. 🔒 Confidential Settlement

Every trade settles through iExec Confidential Tokens (cTokens). ERC-20 tokens are wrapped inside TEE enclaves via the Nox Protocol, so on-chain amounts are **fully encrypted**. Arbiscan shows gibberish. DarkDesk shows the real deal.

### 3. 🔍 Split-Screen Verifier

A side-by-side comparison view that proves the privacy claim in real-time:

- **Left panel**: Arbiscan explorer showing the encrypted on-chain transaction
- **Right panel**: DarkDesk's decrypted view showing actual balances and trade details

### Additional Features

| Feature | Description |
|---------|-------------|
| 📈 **Live Price Oracle** | Alpaca Markets API for real-time T-Bill yields and stock prices — zero mocked data |
| 🤝 **Atomic Escrow** | Solidity contract holding both parties' cTokens until conditions are met |
| 🔐 **Confidential Wrap/Unwrap** | One-click ERC-20 ↔ cToken conversion via iExec Nox Protocol (ERC-7984 TEE standard) |

## 🏗️ How we built it

### Frontend

- **Next.js 16** (App Router) with **React 19** for the dashboard
- **Tailwind CSS v4** with a Bloomberg Terminal / dark pool aesthetic (dark mode, glassmorphism, JetBrains Mono typography)
- **wagmi v2 + viem + RainbowKit** for wallet connectivity on Arbitrum Sepolia

### AI Layer

- **ChainGPT Web3 LLM API** powers the AI Negotiator via a streaming chat endpoint (`src/app/api/chat/route.ts`)
- The agent is context-aware: it knows market prices, understands RWA terminology, and can structure trade proposals

### Market Data

- **Alpaca Markets API** (live paper trading account) provides real-time pricing for T-Bills, equities, and yields
- All market data is **live** — absolutely zero mocked values anywhere in the application

### Privacy & Settlement

- **iExec Nox Protocol** for TEE-based Confidential Token wrapping/unwrapping
- **ERC-7984 (TEE)** standard via `@iexec-nox/nox-confidential-contracts` (v0.1.0) and `@iexec-nox/nox-protocol-contracts` (v0.2.2) — not OZ/Zama FHE
- **DarkDeskEscrow.sol** — custom Solidity 0.8.28 contract importing `IERC7984` and `euint256` directly from the Nox SDK, holding both parties' cTokens in atomic escrow
- Deployed on **Arbitrum Sepolia** (Chain ID: 421614)

### Quality

- **100% test coverage** (Jest + React Testing Library)
- Full CI pipeline: lint → typecheck → test:coverage

## 🏆 iExec Tools Used

We deeply integrated iExec's privacy stack:

1. **Nox Protocol ERC-7984 (TEE Confidential Tokens)** — The core innovation. We import `IERC7984` and `euint256` directly from `@iexec-nox/nox-confidential-contracts` and `@iexec-nox/nox-protocol-contracts` — the correct TEE implementation, not OZ/Zama FHE. Every OTC settlement wraps ERC-20 tokens into cTokens inside TEE enclaves, so on-chain explorers (Arbiscan) cannot read trade amounts or balances. Implementation: `contracts/DarkDeskEscrow.sol` (Solidity ^0.8.28)
2. **Confidential Wrap/Unwrap Flow** — Users convert standard ERC-20 tokens to confidential cTokens before entering escrow, and unwrap back to standard tokens after settlement completes. This is surfaced in the UI as a one-click operation.
3. **Split-Screen Verifier** — We built a dedicated verification page that renders the same transaction from two perspectives: the public Arbiscan view (encrypted/gibberish) vs. the private DarkDesk view (real balances). This is the most compelling visual proof of iExec's confidential computing value.

**Developer Feedback**: See `feedback.md` in the repository root for our detailed experience report on iExec tools.

## 🤖 ChainGPT Tools Used

We integrated ChainGPT as the AI backbone of the trade negotiation engine:

1. **Web3 LLM API** — Powers the conversational AI agent that brokers OTC trades. The agent understands RWA-specific terminology, can reference live market data from Alpaca, and structures trade proposals in natural language. Implementation: `src/lib/chaingpt.ts`
2. **Streaming Chat** — The API route (`src/app/api/chat/route.ts`) streams ChainGPT responses token-by-token for a real-time negotiation experience, similar to how Bloomberg Terminal chat works.

## 🧗 Challenges we ran into

- **Confidential Token UX**: Making TEE wrapping feel seamless rather than intimidating required significant UI work. We settled on a "one-click wrap" pattern that abstracts the complexity.
- **Live market data timing**: Alpaca's API has rate limits and market hours. We implemented graceful fallbacks so the trading desk always shows the latest available price, even outside trading hours.
- **Bloomberg aesthetic at hackathon speed**: Achieving a convincing institutional terminal look (glassmorphism, mono typography, real-time data tickers) while shipping fast required careful Tailwind component design.

## 🚀 What's next

- **Multi-party escrow**: Support 3+ counterparties in a single confidential settlement
- **RWA token registry**: Curated list of tokenized real-world assets with live yield data
- **Order book matching**: AI-powered dark pool matching engine for larger institutional flow
- **Mainnet deployment**: Move from Arbitrum Sepolia to Arbitrum One for production use
