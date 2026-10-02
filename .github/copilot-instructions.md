# Agent Steering: Bun-first workflow

Use Bun as the default runtime and package manager for this repository.

## Core rules

- Prefer Bun for all JavaScript/TypeScript tasks.
- Use `bun install` for dependency installation.
- Use `bun add <pkg>` and `bun remove <pkg>` for dependency changes.
- Use `bun run <script>` or `bun <script>` for package scripts.
- Use `bun x <tool>` for local CLI tools (for example linting, formatting, type-checking).
- Use `bun --hot src/index.ts` for development when relevant to this project.
- Use `bun build` for build steps where project scripts already define it.

## Preferred command mapping

- `npm install` / `pnpm install` / `yarn install` -> `bun install`
- `npm run dev` / `pnpm dev` / `yarn dev` -> `bun dev`
- `npx <tool>` -> `bun x <tool>`
- `node <file>` / `ts-node <file>` for project tasks -> `bun <file>`

## Constraints

- Do not introduce npm, pnpm, or yarn commands unless explicitly requested by the user.
- Do not add Node-specific tooling when Bun already provides an equivalent workflow.
- If a command is truly incompatible with Bun, explain why and use the minimal fallback command.

## Devcontainer alignment

- Assume Bun is available in the devcontainer and prefer Bun-based commands in setup, validation, and troubleshooting steps.
