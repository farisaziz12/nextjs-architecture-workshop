# Exercise 04 — Critical and optional dependencies

Continue the 45-minute session from Exercise 02. This app is a financial dashboard: transactions are critical; analytics are optional.

## Run

Run `pnpm mock-api` in one terminal and `pnpm exercise 04` in another. The runner uses a production build; stop and rerun after edits. Stop the exercise before running `pnpm solution 04`, since both use port 3000.

## Implement

1. In `src/utils/prefetcher.ts`, wrap the base `prefetch` in try/catch. Report the error and return `{ type: "error", error }`; successful results use `type: "data"`.
2. Read the already-provided `criticalQuery` and `optionalQuery` wrappers. The former rethrows an error result; the latter returns null. Both depend on the base helper returning the correct result.
3. In `src/pages/index.tsx`, change the transaction prefetch to `criticalQuery` and analytics to `optionalQuery`.
4. The provided `withTimeout` already rejects and clears its timer. Preserve it: a slow critical query must fail, not succeed with null.
5. As the UI completion step, show an analytics-unavailable message after an optional SSR failure, a loading state while fetching, and an explicit empty message for a successful null response. Use the solution for comparison. Disable automatic client retries during the demonstration so failure states are visible promptly; retain manual refresh.

A critical SSR error reaches Next.js Pages Router’s `_error.jsx`/`500.tsx` handling, not the client component boundary from Exercise 03. Optional failures allow the dashboard to render after the bounded prefetch wait; this is not streaming or zero waiting.

## Verification matrix

First reset the mock to deterministic healthy defaults:

```sh
curl -s http://localhost:3001/settings -H 'Content-Type: application/json' -d '{"failureRate":0,"latencyMin":100,"latencyMax":100,"timeout":false,"malformedData":false,"criticalEndpointFailure":false,"optionalEndpointFailure":false,"optionalLatencyMs":0,"optionalEndpointEmpty":false}'
```

Set one condition at a time, then reload. The failure toggles are also in the mock dashboard. Latency/empty controls use the settings endpoint:

| Condition | Setting | Expected result |
|---|---|---|
| Healthy | Defaults above | Transactions and analytics populated |
| Optional failure | `optionalEndpointFailure: true` | Transactions remain usable; analytics unavailable |
| Optional timeout | `optionalLatencyMs: 3000` | With the 2000ms SSR budget, transactions render and analytics is unavailable initially; a later browser request can recover |
| Successful empty response | `optionalEndpointEmpty: true` | Transactions remain; “No analytics available yet” is distinct from an error |
| Critical failure | `criticalEndpointFailure: true` | Framework error page / HTTP 500 |
| Critical timeout | `latencyMin: 3000, latencyMax: 3000` | Critical deadline produces framework error page / HTTP 500 |
| Recovery | Reset defaults | Reload or refresh analytics restores data |

For example, set the empty case with:

```sh
curl -s http://localhost:3001/settings -H 'Content-Type: application/json' -d '{"optionalEndpointEmpty":true}'
```

Reset defaults between cases to avoid overlapping conditions. Keep the distinction between loading, failure, and successful empty data. A race stops waiting but does not cancel the underlying request. The base prefetch reports errors; the existing HTTP fetcher may also report upstream failures, so do not infer exactly-once telemetry delivery.
