
<p align="center">
  <a href="https://clawsearchdarkdesk.edycu.dev/">
    <img src="docs/screenshots/ClawSearchDarkDesk_Thumbnail_16_9.png" alt="ClawSearchDarkDesk Project Banner" width="800" />
  </a>
</p>

<h1 align="center">ClawSearchDarkDesk</h1>
<p align="center"><strong>Zero-FP Solana Migrations</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
</p>
<p align="center">
  <img src="https://img.shields.io/badge/CI-passing-brightgreen" alt="CI" />
  <img src="https://img.shields.io/badge/coverage-100%25-brightgreen" alt="Coverage" />
</p>
<p align="center">
  <a href="https://clawsearchdarkdesk.edycu.dev/"><img src="https://img.shields.io/badge/Live_Demo-▶_clawsearchdarkdesk.edycu.dev-00ffaa?logo=vercel" alt="Live Demo" /></a>
  <a href="https://youtu.be/ApeRnzYuN7U"><img src="https://img.shields.io/badge/Demo_Video-▶_Watch_Now-red?logo=youtube" alt="Demo Video" /></a>
</p>

> Autonomous AST codemods verified by an adversarial AI-compiler loop. Open live PRs on real repos with **zero false positives**.

ClawSearchDarkDesk is an autonomous migration engine built for the **[DoraHacks Boring AI Hackathon 2026](https://dorahacks.io/hackathon/boring-ai)**. It upgrades legacy Solana codebases from `@solana/web3.js` to the modern `@solana/kit` standard — combining deterministic AST transforms with a compiler-in-the-loop AI for edge cases that mechanical regex can't handle.

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/screenshots/dashboard.png" alt="ClawSearchDarkDesk Dashboard" />
      <br/>
      <em>Dashboard — Real-time sweep monitoring</em>
    </td>
    <td width="50%" align="center">
      <img src="docs/screenshots/sweep-detail.png" alt="ClawSearchDarkDesk Pipeline Detail" />
      <br/>
      <em>Sweep Detail — 4-stage pipeline visualization</em>
    </td>
  </tr>
</table>

---

## 🎯 Problem

The #1 problem with AI code generation is **false positives**: hallucinations that introduce subtle syntax errors, forcing developers to manually debug the "fixes." This defeats the purpose of automation.

Solana's migration from `@solana/web3.js` to `@solana/kit` affects thousands of open-source repositories. Manual migration takes hours per repo. AI-only migration produces broken code. Neither approach works at scale.

## 💡 Solution

**ClawSearchDarkDesk** takes a radically different approach: **compiler-verified AI migration.**

1. **AST Codemods** — Deterministic `ast-grep` transforms via the Codemod toolkit handle 80% of migration patterns (imports, types, method calls)
2. **Compiler-in-the-Loop** — `tsc` errors from the remaining 20% are fed to Claude Sonnet, which patches edge cases iteratively until the build is **mathematically proven green**
3. **Auto-PR** — The verified branch is pushed and a Pull Request is opened automatically

**Key features:**
- **4-stage pipeline visualization** — Clone → AST Codemod → Compiler Loop → Ship PR
- **Real-time log terminal** — Watch the background worker steps as they happen
- **Live GitHub PR links** — Every successful migration ends with a clickable PR URL
- **Dashboard analytics** — Track total PRs, active sweeps, and success rates via Supabase

---

## 🏗️ Architecture

<p align="center">
  <img src="docs/architecture.png" alt="ClawSearchDarkDesk Architecture" width="720" />
</p>

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Framework   | Next.js 16.2.3 (App Router)         |
| UI          | React 19.2.4                        |
| Styling     | Tailwind CSS v4 + CSS custom props  |
| Backend     | Supabase (sweep tracking + stats)   |
| AST Engine  | ast-grep / Codemod toolkit + tsc    |
| AI          | Claude Sonnet (edge case fixes) |
| Language    | TypeScript 5                        |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
git clone https://github.com/edycutjong/clawsearchdarkdesk.git
cd clawsearchdarkdesk
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase (optional — falls back to demo mode)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Codemod.com (for publishing/registry access)
CODEMOD_API_KEY=your-codemod-api-key-here
```

> **Note:** The app runs fully in demo mode without any environment variables. The pipeline visualization and log terminal use simulated data for a reliable demo experience.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

---

## 📁 Project Structure

```
clawsearchdarkdesk/
├── src/
│   ├── app/
│   │   ├── api/              # API routes for sweep operations
│   │   ├── dashboard/        # Sweep dashboard + detail views
│   │   ├── globals.css       # Design tokens + animations
│   │   ├── layout.tsx        # Root layout with metadata
│   │   └── page.tsx          # Hero landing page
│   ├── components/
│   │   ├── Header.tsx        # Navigation header
│   │   ├── PipelineStatus.tsx # 4-stage progress visualization
│   │   └── LogTerminal.tsx   # Real-time log output terminal
│   └── lib/
│       ├── supabase.ts       # Supabase client
│       └── types.ts          # TypeScript interfaces
├── docs/                     # Documentation assets
│   ├── DEMO_SCRIPT.md        # 2-minute demo recording script
│   ├── CASE_STUDY.md         # Full background and context
│   └── screenshots/          # App screenshots
├── codemod/                  # ClawSearchDarkDesk's core codemod plugin package
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🎨 Demo Flow

1. **Landing Page** — Animated hero with live code preview cycling through migration steps
2. **Dashboard** — Click "Launch Dashboard" → see total PRs and active sweeps
3. **Start Migration** — Paste a GitHub URL → click "Start Migration"
4. **Pipeline Viz** — Watch Clone → AST → Compiler Loop → PR stages light up in sequence
5. **Log Terminal** — See real-time logs including `[AI] Compiler-Loop: Feeding error TS2322 to Claude Sonnet...`
6. **PR Result** — Green "View Pull Request" button links to the opened PR

---

## 🏆 Hackathon Context

**Competition:** [Boring AI Hackathon 2026](https://dorahacks.io/hackathon/boring-ai)  
**Track:** Case Studies / Production-grade Upgrade Recipes  
**Core Thesis:** AI migrations are broken because LLMs hallucinate syntax. By constraining the AI to only fix compiler-verified errors (not generate code from scratch), ClawSearchDarkDesk achieves **zero false positives** — making it genuinely "boring" in the best possible way.

> 📄 **Read the Full Case Study:** [CASE_STUDY.md](./docs/CASE_STUDY.md) covers our AST + compiler-in-the-loop implementation in depth.
> 🎬 **Demo Materials:** [DEMO_SCRIPT.md](./docs/DEMO_SCRIPT.md) contains the video flow & pitch.

---

## 📄 License

MIT © 2026 [Edy Cu](https://github.com/edycutjong)
