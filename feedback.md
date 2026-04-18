# iExec Tools Feedback — ClawSearch DarkDesk

> Structured feedback about the iExec developer experience, submitted as part of the Vibe Coding Challenge requirements.

## Tools Used

| Tool | Version | Purpose in Project |
|---|---|---|
| **iExec Nox Protocol** | Sepolia | Confidential Token wrapping (cUSDC, cT-BILL) for private OTC settlement |
| **Confidential Tokens** | ERC-20 wrapper | Hidden balances + hidden transaction amounts on Arbitrum Sepolia |
| **Arbitrum Sepolia** | Chain ID 421614 | Testnet deployment for escrow smart contract |

## What Worked Well

1. **Confidential Token concept is powerful** — The idea of wrapping any ERC-20 into a privacy-preserving equivalent that stays composable with DeFi is genuinely innovative. This solves a real institutional pain point.

2. **TEE-based architecture is compelling** — Using Trusted Execution Environments for on-chain computation on encrypted data provides a much stronger privacy guarantee than ZK approaches for certain use cases (like OTC settlement where both parties need to verify).

3. **Clear value proposition** — The pitch of "Arbiscan sees $0.00, your dApp sees the real balance" is immediately understandable and demo-friendly. This made our split-screen verifier the star of the demo.

## Challenges Encountered

1. **Documentation depth** — The Nox Protocol docs could benefit from more end-to-end tutorials. A "Build your first Confidential Token dApp" walkthrough with complete code samples would significantly reduce onboarding time.

2. **SDK examples** — More code examples for common patterns (wrap, unwrap, confidential transfer, reading encrypted balances) would help developers move faster during hackathons.

3. **Testnet tooling** — A faucet for pre-wrapped confidential tokens on Sepolia would be helpful for testing, so developers don't need to deploy their own test tokens first.

## Suggestions

1. **Starter template** — A Next.js + wagmi starter template with Nox SDK pre-configured would be a huge accelerator for hackathon builders.

2. **Explorer integration** — A "Confidential View" toggle on Arbiscan (or a dedicated explorer) that authenticated users can use to decrypt their own transactions would be a killer feature.

3. **ChainGPT integration docs** — Since ChainGPT is a partner for this hackathon, having joint documentation for "AI + Confidential Computing" patterns would help developers see the combined value.

## Overall Rating

**Developer Experience**: 7/10 — Strong concept, room for more documentation and tooling.

**Would use again**: Yes — particularly for institutional DeFi applications where privacy is a hard requirement, not a nice-to-have.

---

*Submitted by [@edycutjong](https://x.com/edycutjong) as part of the iExec Vibe Coding Challenge 2026.*
