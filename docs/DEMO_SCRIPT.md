# ClawSearchDarkDesk Hackathon Demo Recording Script

## Setup
1. Open [http://localhost:3000](http://localhost:3000) inside a clean browser window (1080p minimum resolution).
2. Prepare a sample repository URL to paste, e.g., `https://github.com/solana-developers/program-examples`

## Flow (2 Minutes)

### 1. Introduction (0:00 - 0:20)
*   **Action**: Display the Landing Page (`/`). Scroll smoothly down to the "How it Works" section.
*   **Voiceover**: "Welcome to ClawSearchDarkDesk. We automate the massive migration from legacy Web3.js to the new `@solana/kit` standard using compiler-in-the-loop AI."

### 2. Dashboard & Invocation (0:20 - 0:45)
*   **Action**: Click the **"Open Dashboard"** button in the header.
*   **Action**: Briefly point out the total PRs and live active sweeps powered by Supabase.
*   **Action**: Paste your sample URL (`https://github.com/solana-developers/program-examples`) into the input box and click **"Start Migration"**. 
*   **Voiceover**: "Let's migrate the official solana-developers program examples. Simply drop the GitHub URL on the dashboard..."

### 3. Pipeline Real-Time Visualization (0:45 - 1:15)
*   **Action**: The UI will automatically redirect to the Sweep Detail view (`/dashboard/YOUR_ID`).
*   **Action**: Watch the "Pipeline Status" horizontally highlight from **Cloning** → **AST Transforms**.
*   **Action**: Scroll down slightly to ensure the **Log Terminal** is fully visible on screen. Watch the console print the background worker steps mimicking the container spin-up and code replacements. 
*   **Voiceover**: "Our background worker immediately spins up. First, we run lightning-fast `ast-grep` codemods to handle the mechanical replacements."

### 4. Compiler-in-the-Loop Action (1:15 - 1:40)
*   **Action**: Let the pipeline progress to **Compiler-in-the-Loop**. Wait for the purple 'ai' log to appear in the terminal (`[AI] Compiler-Loop: Feeding error TS2322 to Claude Sonnet...`).
*   **Voiceover**: "Mechanical regex isn't enough. We run `tsc` to find type mismatches and feed them directly into an LLM agent to iteratively patch the edge cases."

### 5. Conclusion & PR Hook (1:40 - 2:00)
*   **Action**: Once the pipeline completes and transitions to **Publishing PR**, hover over the new glowing green **"View Pull Request"** button.
*   **Voiceover**: "Once all tests pass, ClawSearchDarkDesk autonomously opens a Pull Request on GitHub. That's it—migration complete with zero human intervention."
