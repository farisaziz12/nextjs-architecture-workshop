# Next.js Architecture Workshop

## 🚀 Overview

This repository contains a series of exercises and solutions for implementing resilience patterns in Next.js applications. You'll work with a fully functional e-commerce application, "ResilioStore," improving its resilience against various failure scenarios.

Each exercise focuses on a specific resilience pattern, with both starter code and complete solutions provided.

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

1. Clone the repository:
   ```
   git clone git@github.com:farisaziz12/nextjs-architecture-workshop.git
   cd nextjs-architecture-workshop
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the example environment file:
   ```
   cp .env.example .env.local
   ```

4. Start a specific exercise:
   ```
   npm run exercise 01
   ```

5. Run a solution:
   ```
   npm run solution 01
   ```

6. Run the mock API server (required for most exercises):
   ```
   npm run mock-api
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

Each exercise directory contains:

- `README.md` - Instructions and requirements
- `pages/` - Next.js pages with TODO comments
- `components/` - React components specific to the exercise
- `lib/` - Utility functions and hooks needed for the exercise

## 🧪 Mock API

The workshop includes a simulated backend that can be configured to fail in various ways:

- Randomized failures
- Slow responses
- Malformed data
- Service unavailability

Control failure modes through the API dashboard at `http://localhost:3001` when running the mock server.


## 🔧 Technical Stack

- Next.js (Pages Router)
- TanStack Query for data fetching
- `opossum` for circuit breaking
- `react-error-boundary` for error handling
- Tailwind CSS for styling

## Ready to get started?

Begin with Exercise 1 to start building resilient Next.js applications!

```
npm run exercise 01
```