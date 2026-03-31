# AI Guidance & Agent Roles: FinTrack Development

This document outlines the interaction between the human developer and the AI Agent (Antigravity) during the construction of **FinTrack**. It serves as a record of the specialized instructions and constraints used to guide the AI, ensuring the final product meets high standards of **Structure**, **Simplicity**, and **Change Resilience**.

## 🧠 AI Strategy: Pair-Programming Agent
The AI was used as a senior-level technical architect and implementer, operating under a **Planning Mode** workflow. This ensured that no code was written without prior research and a structured implementation plan approved by the human developer.

### 🎯 Key Prompting Rules & Constraints
1. **Glassmorphism Aesthetic**: The AI was explicitly instructed to prioritize a "Premium Look" using Tailwind CSS v4, focusing on `backdrop-blur`, subtle gradients, and dark-mode first principles.
2. **Modular Architecture**: A constraint was set to avoid "monolithic" files. The AI was guided to use **Flask Blueprints** and **React Components** with clear boundaries for high **Change Resilience**.
3. **Production Sanitization**: A specific instruction was given to remove all non-essential developer comments before final submission to achieve a "lean" production codebase, focusing on self-documenting code.
4. **Relational Integrity**: The AI was mandated to use **SQLAlchemy models** to enforce valid states in the database, preventing orphans and invalid data types.

## 🤖 Interaction Workflow
- **Research Phase**: For complex features (like the Analytics calculation or the Transaction dropdown clipping fix), the AI performed multi-step research on the existing codebase before proposing changes.
- **Verification Loop**: After generating UI or backend logic, the AI used a browser-based subagent to visually verify the layout, theme consistency, and API responsiveness in real-time.
- **Refinement Cycle**: The developer provided iterative feedback (e.g., "Rebrand Artha to FinTrack", "Fix the currency symbol in the account edit option"), which the AI executed with global grep tools to ensure 100% consistency.

## 🛡️ Safety & Safeguards
- **Environment Isolation**: The AI used **Docker Compose** as a safeguard to ensure that the environment remains isolated and predictable across different evaluation machines.
- **Linting & Code Quality**: The AI proactively monitored lint warnings (e.g., unknown CSS rules in Tailwind v4) and verified that they were expected behavior for the modern toolchain.

## 🛠️ Tools Used by the Agent
- **Antigravity Framework**: Advanced agentic coding system.
- **Browser Subagent**: For visual and functional UI testing.
- **Shell & Ripgrep**: For deep codebase analysis and global rebranding.
- **Mermaid & Artifacts**: For architectural visualization and tracking implementation progress.

**This project is a testament to safe, efficient, and high-quality human-AI collaboration in software engineering.**
