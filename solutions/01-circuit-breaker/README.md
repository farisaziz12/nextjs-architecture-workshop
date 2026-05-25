# Solution 01 — Circuit Breaker Pattern

Reference implementation for [Exercise 01](../../exercises/01-circuit-breaker/README.md). Start there if you haven't tried the exercise yet — reading the solution first defeats the point.

## 🔌 How to run

```bash
pnpm mock-api       # in one terminal
pnpm solution 01    # in another
```

## 🔍 Key implementation choices

- **One breaker per module, not per request.** Circuit state (failure count, last open time) must persist across requests, so the `CircuitBreaker` instance lives at module scope in each API route.
- **Fallback returns `{ products: [], circuitStatus: 'open' }`.** Empty data + an explicit status field — the client can render a banner instead of guessing why the list is empty.
- **`errorThresholdPercentage: 50` and `resetTimeout: 1000`** are aggressive for a workshop. In production these should be tuned to the real failure rate baseline (the breaker should never open for normal noise) and the upstream's typical recovery time.
- **Coloured console logs in `lib/circuitBreaker.ts`** are a workshop convenience for spotting state transitions in the terminal. In production you'd emit structured events / OpenTelemetry spans instead.

## 💬 Discussion prompts

- What's the difference between a circuit breaker and a retry? When do you want both?
- What happens if you make `resetTimeout` too short? Too long? Who pays the cost of each?
- A circuit opens during a Black Friday spike — is that a bug in the breaker config or a bug in the upstream? How do you tell?
- The breaker here protects an internal API. Would you use one in front of a payment provider or auth service? What changes about the fallback?
