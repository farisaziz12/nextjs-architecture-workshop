// Focused runtime regression checks using the installed Solution 04 dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const dependency = createRequire(path.join(root, 'solutions/04-query-criticality/package.json'));
const ts = dependency('typescript');
const { QueryClient } = dependency('@tanstack/react-query');
const cache = new Map();
let reports = [];
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'module', 'exports', code)(id => {
    if (id === '@sentry/nextjs') return { captureException: error => reports.push(error) };
    if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id + '.ts'));
    return dependency(id);
  }, module, module.exports);
  return module.exports;
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
  const unhandled = [];
  process.on('unhandledRejection', error => unhandled.push(error));
  for (const exercise of ['02-timeout-pattern', '04-query-criticality']) {
    const base = path.join(root, 'solutions', exercise, 'src/utils');
    const { createPrefetch } = load(path.join(base, 'prefetcher.ts'));
    const { withTimeout } = load(path.join(base, 'timeout.ts'));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
    const helper = createPrefetch(client, 15);
    if (exercise.startsWith('02')) {
      assert.deepEqual(await helper.prefetch(['ok'], async () => 42), { type: 'data', data: 42 });
      const timed = await helper.prefetch(['slow'], () => new Promise(() => {}));
      assert.equal(timed.type, 'error'); assert.equal(timed.error.name, 'TimeoutError');
      const failed = await helper.prefetch(['bad'], async () => { throw Error('HTTP 500'); });
      assert.equal(failed.type, 'error'); assert.equal(failed.error.message, 'HTTP 500');
    } else {
      assert.equal(await helper.criticalQuery(['ok'], async () => 42), 42);
      assert.equal(await helper.optionalQuery(['empty'], async () => null), null);
      await assert.rejects(helper.criticalQuery(['slow'], () => new Promise(() => {})), { name: 'TimeoutError' });
      assert.equal(await helper.optionalQuery(['slow-optional'], () => new Promise(() => {})), null);
      await assert.rejects(helper.criticalQuery(['bad'], async () => { throw Error('HTTP 500'); }), /HTTP 500/);
      assert.equal(await helper.optionalQuery(['optional-bad'], async () => { throw Error('HTTP 500'); }), null);
      // A failed optional request must not erase or invalidate critical data.
      assert.equal(client.getQueryData(['ok']), 42);
      assert.equal(await helper.optionalQuery(['optional-bad'], async () => 7), 7);
    }
    const realSet = global.setTimeout, realClear = global.clearTimeout;
    const active = new Set();
    global.setTimeout = (...args) => { const timer = realSet(...args); active.add(timer); return timer; };
    global.clearTimeout = timer => { active.delete(timer); return realClear(timer); };
    try {
      assert.equal(await withTimeout(Promise.resolve(1), 1000), 1);
      assert.equal(active.size, 0);
      await assert.rejects(withTimeout(Promise.reject(Error('early failure')), 1000));
      assert.equal(active.size, 0);
    } finally { global.setTimeout = realSet; global.clearTimeout = realClear; }
    await assert.rejects(withTimeout(delay(30).then(() => { throw Error('late failure'); }), 5), { name: 'TimeoutError' });
    await delay(40); assert.deepEqual(unhandled, []);
    client.clear();
    console.log('PASS', exercise, 'success/failure, deadline, cleanup, late rejection, recovery');
  }
  assert(reports.some(e => e.name === 'TimeoutError'));
})().catch(error => { console.error(error); process.exitCode = 1; });
