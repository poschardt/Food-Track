@AGENTS.md

# Food-Track

A meal and ingredient tracking app — also a learning project for Claude Code skills, agents, hooks, and the Anthropic SDK.

## How to run
```
npm run dev        # starts dev server at http://localhost:3000
npx ts-node agents/<name>.ts   # run an agent script directly
```

## Architecture

- **`app/api/`** — Next.js API Routes (the backend). Each `route.ts` file is an HTTP endpoint.
- **`agents/`** — TypeScript scripts that call the Claude API for specific tasks (ingredient checking, nutrition, suggestions).
- **`.claude/commands/`** — Custom slash commands (skills). Type `/skill-name` in Claude Code to invoke.
- **`lib/claude.ts`** — The ONLY place the Anthropic client is created. All Claude API calls flow through here.
- **`lib/db.ts`** — SQLite singleton. All database access goes through this.
- **`data/food-track.db`** — SQLite database file (gitignored, created at runtime).

## Learning phases
1. Foundation — Next.js + SQLite, no AI
2. First Claude API call — `messages.create`, JSON extraction
3. First skill — `.claude/commands/`, `$ARGUMENTS`
4. Cook a recipe — multi-step agent chaining
5. Streaming nutrition — `messages.stream()`
6. Hooks — automated behaviors via `.claude/settings.json`
7. Tool use — agentic loops, Claude calling functions

## Key rules
- Never create a second Anthropic client — always import from `lib/claude.ts`
- Never write directly to `data/food-track.db` — use the API routes or `lib/db.ts`
- Use `path.join()` for file paths, never hardcode backslashes

## Windows gotcha
If `better-sqlite3` fails to load after a Node version change, run: `npm rebuild better-sqlite3`
