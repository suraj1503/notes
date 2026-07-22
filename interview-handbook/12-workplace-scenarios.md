# Part L — Real Workplace Scenarios (Q69–Q78)

[← Back to Index](00-INDEX.md)

> These test **judgment, communication, and debugging maturity**. Prefer STAR + evidence over blame.

---

<a id="q69"></a>
## Q69 — Manager says an API is slow; you cannot reproduce it ⭐🗣️

### STAR

- **Situation:** Manager reports slowness; your curl/local tests look fine.  
- **Task:** Validate the report and find environment/user-specific causes without dismissing it.  
- **Action:**
  1. Ask for **when, who, endpoint, region, screenshot, request id**.  
  2. Check **p95/p99** not averages — slow for a percentile you didn’t hit.  
  3. Compare **prod traces** for that timeframe vs your repro.  
  4. Check **tenant-specific data volume**, feature flags, CDN miss, mobile network.  
  5. Add temporary **high-cardinality-safe** metrics / logging for that route.  
  6. Try repro from same region / same account shape / same payload size.  
- **Result:** Either confirmed (fix) or explained (client-side / specific tenant) with data.

### Follow-ups
- How do you push back diplomatically on anecdotes?

### What not to say
- “Works on my machine / not a real issue.”

---

<a id="q70"></a>
## Q70 — Two developers claim the bug is in each other's code 🗣️

### STAR

- **Situation:** FE vs BE blame game; bug unresolved.  
- **Task:** Find truth with contracts and evidence, keep it blameless.  
- **Action:**
  1. Reproduce with **Network tab**: status, payload, timing.  
  2. Compare against **API contract** (OpenAPI) — who violates?  
  3. Share **trace_id** spanning both sides.  
  4. Write a **minimal failing test** or Pact contract test.  
  5. Facilitate: “Let’s look at the wire,” not “who’s wrong.”  
- **Result:** Root cause identified (e.g. BE changed enum; FE not updated); contract test added.

### What not to say
- Taking sides without evidence; public blame.

---

<a id="q71"></a>
## Q71 — Your deployment caused failures — how do you recover? ⭐🗣️

### STAR

- **Situation:** Your release correlates with errors.  
- **Task:** Restore service fast; own the incident.  
- **Action:**
  1. Announce in incident channel; don’t go silent.  
  2. **Rollback** / disable flag immediately if safe.  
  3. If migration blocks rollback, **fix-forward** with hotfix under change control.  
  4. Verify metrics; communicate all-clear.  
  5. Postmortem with action items (canary, better tests).  
- **Result:** MTTR minimized; trust preserved by ownership.

### What not to say
- Hiding that it was your deploy.
- Debugging for an hour without rollback on SEV-1.

---

<a id="q72"></a>
## Q72 — Database CPU at 100% — immediate steps ⭐🗣️

### STAR / runbook

**Immediate (minutes)**
1. Confirm impact (app errors/latency).  
2. Identify **top queries / currentOp** / slow query log.  
3. Kill safe runaway queries if policy allows.  
4. Scale app carefully — more pods can **worsen** DB.  
5. Enable cache / shed read traffic / disable heavy reports.  
6. Check recent deploy introducing bad query.  
7. Add emergency index **only** if understood (index builds have cost).  

**Next:** permanent query fix, rate limit reports, capacity plan.

### What not to say
- Restarting DB as first step without identifying queries.
- Blindly adding 20 indexes in prod during the fire.

---

<a id="q73"></a>
## Q73 — Users complain about slow page loads 🗣️

### Approach
1. **RUM / Lighthouse / Web Vitals** (LCP, INP, CLS)  
2. DevTools: TTFB vs download vs JS  
3. If TTFB high → API/DB (Q05)  
4. If assets → CDN, bundle size, images  
5. Waterfall of API calls (chatty FE)  
6. Regional differences  

### What not to say
- Blaming backend automatically for “slow page.”

---

<a id="q74"></a>
## Q74 — Third-party API is timing out — how would your application handle it? ⭐

### Answer — resilience design

1. **Timeouts** shorter than user patience; don’t hang workers  
2. **Retries** only for idempotent/safe calls with exponential backoff + jitter  
3. **Circuit breaker** when error rate high  
4. **Fallback** — cached response, queue for later, degraded UX  
5. **Bulkhead** — dedicated pool so third-party can’t exhaust all sockets  
6. **User messaging** — clear “payment provider delayed”  
7. **Async** where possible (webhook completion)  
8. **Observability** — dependency SLO dashboard  

### What not to say
- Blocking the request forever.
- Unlimited retries that amplify outages.

---

<a id="q75"></a>
## Q75 — Logs show no errors; users still report failures 🗣️

### Thought process
You’re blind — instrument the gap.

### STAR actions
1. Confirm **what failure means** (blank UI, wrong data, slow, mobile only).  
2. Check **client-side errors** (Sentry), network failures, CORS, ad blockers.  
3. **Silent failures:** swallowed exceptions, wrong success UX, 200 with error body.  
4. **Partial outages** — one AZ, one CDN POP.  
5. **Auth/cookie** issues not logged as 5xx.  
6. Add **synthetic monitoring** and better client logging.  
7. Search for that user’s `request_id` end-to-end.  

### What not to say
- “No logs, no problem.”

---

<a id="q76"></a>
## Q76 — Memory leak that only occurs after several hours 🔧

### Answer
1. **Soak test** 4–12+ hours with prod-like traffic  
2. Graph heap baseline over time  
3. Heap snapshots at T0, T+2h, T+6h — comparison  
4. Check cron jobs / cache growth / connection accumulation  
5. Reproduce with feature flags isolated  
6. Fix bounded structures; add memory alert on slope  

### What not to say
- Only short load tests as proof of safety.

---

<a id="q77"></a>
## Q77 — One API call suddenly consumes much more CPU

### Answer
1. Confirm with **CPU profile / flamegraph** on that route  
2. Diff **recent commit** touching that handler  
3. Check **input size** change (huge JSON, regex ReDoS)  
4. Check new **sync crypto**, compression, image work  
5. Check accidental **tight loop** / N² algorithm on larger data  
6. Mitigate: rate limit, feature flag off, move work async  
7. Fix + regression test with large fixture  

### What not to say
- Scaling pods without understanding why CPU per request rose.

---

<a id="q78"></a>
## Q78 — Endpoint 50 ms in development, 5 seconds in production ⭐🗣️

### Thought process
Parity gap: data size, network hops, cold starts, real dependencies, contention.

### STAR investigation

1. **Measure in prod** with trace — where are the ~5 s?  
2. **Compare data volumes** — prod collection 50M vs local 50 rows  
3. **Indexes** present in prod? (sometimes missing on prod-only DB)  
4. **N+1** only hurts with real related data  
5. **Cross-region** calls / DNS / TLS  
6. **Cold start** / serverless / scale-to-zero  
7. **Resource limits** — CPU throttle in K8s makes “same code” slower  
8. **Debug vs prod builds** rarely explain 100× — data/deps usually do  
9. Fix with index/cache/query rewrite; add prod-like seed to staging  

### Real-world example
Dev used local Mongo with indexes from a bootstrap script; prod migration missed a compound index. `explain` in prod showed COLLSCAN. Index → 5 s to 60 ms.

### What not to say
- “Production is just slower.”
- Tuning only local without prod `explain` / traces.

---

## Closing — interview habits that score well

1. **Clarify** before solving  
2. **Measure** before optimizing  
3. **Mitigate** before perfect RCA on SEV-1  
4. **Trade-offs** spoken out loud  
5. **Blameless** ownership language  
6. **End with** how you’d prevent recurrence (test, alert, runbook)

[← Back to Index](00-INDEX.md)
