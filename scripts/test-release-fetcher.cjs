const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const dependency = createRequire(path.join(root, 'solutions/04-query-criticality/package.json'));
const ts = dependency('typescript');
const reports = [];
let active;
const sentry = {
  withScope(fn) {
    active = { tags: {}, contexts: {} };
    try { fn({ setTag: (k, v) => active.tags[k] = v, setContext: (k, v) => active.contexts[k] = v }); }
    finally { active = undefined; }
  },
  captureException(error) { reports.push({ error, ...active }); },
};
const mod = { exports: {} };
const code = ts.transpileModule(fs.readFileSync(path.join(root, 'solutions/04-query-criticality/src/utils/fetcher.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
new Function('require', 'module', 'exports', code)(id => id === '@sentry/nextjs' ? sentry : dependency(id), mod, mod.exports);
const { apiFetcher } = mod.exports;
(async () => {
  const originalFetch = global.fetch;
  try {
    const controller = new AbortController();
    global.fetch = async (_url, options) => {
      assert.equal(options.signal, controller.signal);
      return { ok: false, status: 500, json: async () => ({ message: 'broken analytics' }) };
    };
    await assert.rejects(apiFetcher({ url: '/analytics', signal: controller.signal, errorTag: 'AnalyticsError',
      diagnostics: { feature: 'analytics', release: 'demo-v1', analyticsEnabled: true } }), /broken analytics/);
    assert.deepEqual(reports[0].tags, { errorTag: 'AnalyticsError', feature: 'analytics', demo_release: 'demo-v1' });
    assert.deepEqual(reports[0].contexts, { 'Feature Flags': { analyticsEnabled: true } });
    await assert.rejects(apiFetcher({ url: '/transactions', signal: controller.signal, errorTag: 'TransactionsError' }));
    assert.deepEqual(reports[1].tags, { errorTag: 'TransactionsError' });
    assert.deepEqual(reports[1].contexts, {});
    global.fetch = (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    });
    const request = apiFetcher({ url: '/analytics', signal: controller.signal, errorTag: 'AnalyticsError' });
    controller.abort();
    await assert.rejects(request);
    assert.equal(reports.length, 2, 'intentional cancellation must not report another incident');
    console.log('PASS release fetcher: scoped context, no context leakage, abort propagation, cancellation suppression');
  } finally { global.fetch = originalFetch; }
})().catch(error => { console.error(error); process.exitCode = 1; });
