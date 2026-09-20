# Next.js Architecture Workshop

## 🚀 Overview

This repository contains a series of exercises and solutions for implementing resilience, performance, and observability patterns in Next.js applications. You'll work with different web applications, each facing unique challenges that require specific architectural improvements.

Each exercise focuses on a distinct pattern to address real-world problems, with both starter code and complete solutions provided.

## 🗂 Repository Structure

```
nextjs-architecture-workshop/
├── README.md
├── package.json
├── core-app/                  # Shared code across exercises
│   └── mocks/                 # Mock data and API simulators
├── exercises/                 # Start here for hands-on practice
│   ├── 01-circuit-breaker/
│   ├── 02-timeout-pattern/
│   ├── 03-error-boundaries/
│   ├── 04-query-criticality/
└── solutions/                 # Reference implementations
    ├── 01-circuit-breaker/
    ├── 02-timeout-pattern/
    ├── 03-error-boundaries/
    ├── 04-query-criticality/
    └── ...
```

## 🛠 Setup Instructions

> **Prerequisites**: Node.js ≥ 20 (use the version in `.nvmrc`). This workshop uses [pnpm](https://pnpm.io) via [Corepack](https://nodejs.org/api/corepack.html), which ships with Node.

1. Clone the repository:
   ```
   git clone git@github.com:farisaziz12/nextjs-architecture-workshop.git
   cd nextjs-architecture-workshop
   ```

2. Enable Corepack and install dependencies (pnpm version is pinned in `package.json`):
   ```
   corepack enable
   pnpm install
   ```

3. Copy the example environment file:
   ```
   cp .env.example .env.local
   ```

4. Start a specific exercise:
   ```
   pnpm exercise 01
   ```

5. Run a solution:
   ```
   pnpm solution 01
   ```

6. Run the mock API server (required for most exercises):
   ```
   pnpm mock-api
   ```

## 📋 Exercise Overview

### 1. Circuit Breaker Pattern
Implement circuit breakers for the product catalog API that experiences intermittent failures during high traffic.

### 2. Timeout Pattern
Implement timeout handling for a third-party API that occasionally hangs.

### 3. Error Boundaries
Add error boundaries to prevent the entire UI from crashing when one quadrant fails.

### 4. Query Criticality
Implement critical and optional queries to improve performance and user experience.


## 📁 Detailed Exercise Structure

Each exercise is a standalone Next.js app (Pages Router) with its own `package.json` and dependencies — installed on first run by the runner script. Every exercise directory contains:

- `README.md` — instructions and acceptance criteria
- `package.json` + `tsconfig.json` + `next.config.js` — per-app config
- `pages/api/` — API routes you will modify or instrument
- Next.js source files containing TODO comments where you'll add code

> **Layout note**: Exercises 1 and 3 use a flat layout (`pages/`, `components/`, `lib/` at the app root). Exercises 2 and 4 use the Next.js `src/` convention (`src/pages/`, `src/components/`, `src/utils/`, `src/hooks/`). Both layouts are valid Next.js conventions — be aware which one you're in when navigating. This will be standardized in a future revision.

## 🧪 Mock API

The workshop includes a simulated backend that can be configured to fail in various ways:

- Randomized failures
- Slow responses
- Malformed data
- Service unavailability

Control failure modes through the API dashboard at `http://localhost:3001` when running the mock server.


## 🔧 Technical Stack

- **Next.js** (Pages Router, v14.1.4 – v14.2.24 across exercises)
- **TanStack Query** for data fetching (exercises 2 & 4)
- **`opossum`** for circuit breaking (exercise 1)
- **`react-error-boundary`** for error handling (exercise 3)
- **`@sentry/nextjs`** for observability and error tagging (exercises 2, 3, 4)
- **Mantine** UI + **Tabler Icons** (exercises 2 & 4)
- **Tailwind CSS** for styling

## 🆘 Troubleshooting

- **Port 3000 already in use**: another dev server is running. Either stop it (`lsof -nP -iTCP:3000 -sTCP:LISTEN`) or close the conflicting app. The runner doesn't currently support port overrides.
- **Port 3001 in use**: same for the mock API server.
- **`corepack` missing**: install Node ≥ 16.9 (Corepack ships with it). On older Node, install pnpm globally (`npm i -g pnpm@10`).
- **Sentry warnings during install**: source-map upload and native profiling are intentionally skipped via `pnpm.ignoredBuiltDependencies`. Workshop exercises do not require them.

## Ready to get started?

Begin with Exercise 1 to start building resilient Next.js applications!

```
pnpm exercise 01
```