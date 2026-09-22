# Safe releases and observability — 30 minutes

## Prepare

Start `pnpm mock-api` and `pnpm solution 04` in separate terminals. Open http://localhost:3000/release-demo. This dedicated demo reuses the financial dashboard without changing the Exercise 04 assignment.

Reset the mock to a known baseline:

```sh
curl -s http://localhost:3001/settings -H 'Content-Type: application/json' -d '{"failureRate":0,"latencyMin":100,"latencyMax":100,"timeout":false,"malformedData":false,"criticalEndpointFailure":false,"optionalEndpointFailure":false,"optionalLatencyMs":0,"optionalEndpointEmpty":false}'
```

## 0–10 minutes: diagnose

Load the healthy page, then turn on `optionalEndpointFailure` in the mock dashboard. Click Refresh Analytics. Read the local incident record: error label, feature, demonstration release, and actual flag value. The same fields are attached with a scoped Sentry event when Sentry is configured. The on-page record is an observation of a failed request, not proof of remote telemetry delivery or causation by a release.

Ask: when did failures start, which users/features are affected, and do transactions still succeed? Correlate production events with real release identifiers and request/error rates; the fixed demo label is not automatic release tracking.

## 10–25 minutes: contain and recover

1. Click Disable analytics. The error UI becomes a deliberate disabled state; transaction data and Refresh Transactions remain available.
2. Refresh Analytics is disabled. In browser network tools, confirm no new analytics requests start while the flag is off. An in-flight browser fetch is aborted; backend work may still finish.
3. Leave the backend broken and discuss the containment tradeoff: reduced optional functionality versus a working core task.
4. Restore `optionalEndpointFailure` to false. Click Enable analytics to fetch again and confirm recovery. The last incident remains visible as historical evidence, even after recovery.

For a slow in-flight request, set `optionalLatencyMs` to 3000 via `/settings`, click Refresh Analytics, then disable it. Confirm the client request is cancelled and transactions remain usable. Reset latency to 0 before restoring the feature.

## 25–30 minutes: decide

- Disable when evidence points to an optional feature and the core flow can remain useful.
- Restore after the cause is corrected, then validate request success and the core flow. A real rollout should start with a limited cohort and an observation window.
- Roll back the release if the problem affects core behavior or cannot be contained by the flag; a feature toggle is not a deployment rollback.

This is a browser-session teaching toggle. It resets on reload, does not gate initial server prefetch, is not shared across users, and is not an authorization control. In production, evaluate remotely managed operational flags at the server and client boundaries that start work, define propagation/fallback behavior, and assign an owner and removal policy. Do not interpret fewer reported errors alone as recovery: disabled requests also reduce errors, so verify traffic and successful user actions.

## Acceptance

- Local incident details show the real analytics flag state plus the demo release and feature.
- Disabled analytics hides cached/error content, prevents manual and automatic requests, and cancels the current client query.
- Transactions continue to refresh.
- Re-enabling fetches fresh analytics and recovers after the mock is repaired.
- Exercise 04 at `/` retains its existing lesson and has no release-control panel.
