# Part F — Node.js (Q36–Q40)

[← Back to Index](00-INDEX.md)

---

<a id="q36"></a>
## Q36 — Debug Node.js with high memory usage ⭐🔧

### Thought process
Same family as Q07 — confirm growth pattern, then heap analysis; separate heap vs RSS vs external buffers.

### Answer

1. **Metrics:** `heapUsed`, `heapTotal`, `external`, `rss`, GC pause frequency  
2. **Steady load soak** in staging matching prod Node version  
3. **Heap snapshots** comparison (Chrome DevTools / `heapdump`)  
4. **Allocation sampling** under load  
5. **Check buffers / streams** — `external` memory from Buffer  
6. **Native addons** leaking outside V8 heap (RSS↑ heap flat)  
7. **Fix:** bounded caches, destroy streams, clear listeners, stream large payloads  
8. **Align** `--max-old-space-size` with container limit (leave headroom)

### Real-world example
`external` climbed due to unconsumed request streams on aborted uploads. Added `req.destroy()` on abort + size limits via busboy.

### Common follow-ups
- What is `external` memory?
- Worker threads memory model?

### What not to say
- Only increasing `--max-old-space-size`.

---

<a id="q37"></a>
## Q37 — How do you prevent blocking the event loop? ⭐

### Thought process
Node is single-threaded for JS. Keep CPU bursts off the loop; use async I/O.

### Answer — practices

1. **No heavy sync CPU** on request path (large JSON parse/stringify, image processing, crypto at high cost, big loops)  
2. **Prefer async APIs** (`fs.promises`, async DB drivers) — avoid `fs.readFileSync` in servers  
3. **Chunk work** — `setImmediate` / scheduling for long loops  
4. **Offload** — `worker_threads`, child processes, or external workers (Bull + Redis)  
5. **Monitor** event loop lag (`perf_hooks.monitorEventLoopDelay`, APM)  
6. **Streaming** instead of loading entire files  

### Common follow-ups
- libuv threadpool size (`UV_THREADPOOL_SIZE`)?
- When are sync APIs acceptable (startup)?

### What not to say
- “Node can’t do CPU work” (it can — just not on the main request loop at scale).

---

<a id="q38"></a>
## Q38 — Common causes of event loop blocking ⭐

### Answer — frequent culprits

1. Long `for`/`while` over large arrays in request handler  
2. Sync crypto (`pbkdf2Sync`, high-cost bcrypt sync)  
3. Sync file/DNS APIs  
4. Catastrophic backtracking regex on user input  
5. Huge `JSON.parse` / `JSON.stringify`  
6. Tight CPU compression / image resize in-process  
7. Busy-wait / polling loops  
8. Some poorly written native addons  

**Symptom:** latency rises for **all** requests on that process, CPU high, event loop delay metric spikes.

### Common follow-ups
- How do you detect blocking in production?
- Regex ReDoS mitigation?

### What not to say
- Blaming “Node is slow” without identifying blocking code.

---

<a id="q39"></a>
## Q39 — How would you profile a Node.js application? 🔧

### Thought process
Pick profile type: CPU, heap, or event-loop; prefer staging/prod-safe sampling.

### Answer — toolbox

| Goal | Tools |
|------|-------|
| CPU flamegraphs | `node --cpu-prof`, Clinic Flame, 0x, Datadog/Pyroscope |
| Heap | Chrome DevTools snapshots, Clinic Heap, `heapdump` |
| Event loop | `monitorEventLoopDelay`, Clinic Doctor |
| HTTP spans | OpenTelemetry / APM |
| Linux | `perf` (advanced) |

**Safe prod approach:** short sampling profiles on one canary pod; avoid full heap dumps on large heaps without care (pause/STW impact).

### Example command
```bash
node --cpu-prof --cpu-prof-interval=1000 dist/server.js
# load test, then stop — open .cpuprofile in Chrome DevTools
```

### Common follow-ups
- Overhead of continuous profiling?
- How do you map minified stacks?

### What not to say
- Only `console.time` for production CPU issues.

---

<a id="q40"></a>
## Q40 — How do you handle CPU-intensive tasks in Node.js? ⭐

### Thought process
Don’t block the loop; isolate compute.

### Answer — options (with trade-offs)

1. **`worker_threads`** — same process, transfer/ArrayBuffer; good for CPU chunks  
2. **Child processes / pool** — stronger isolation  
3. **Job queue** (BullMQ + Redis) — best for async user-facing APIs  
4. **Separate microservice** in Go/Rust/Java for heavy compute  
5. **Native addons** — when justified; ops complexity  

**API pattern:** accept request → enqueue job → return `202` + job id → client polls or websocket for result.

### Real-world example
PDF generation moved from Express handler to BullMQ workers (concurrency 2 per pod). API p99 dropped from 4 s to 80 ms; workers scaled independently.

### Common follow-ups
- Shared memory / transferable objects?
- How do you bound worker concurrency vs CPU cores?

### What not to say
- Running CPU work inline “because await makes it async” (await doesn’t move CPU off the thread).

---

[← Back to Index](00-INDEX.md) · [Next: Microservices →](07-microservices.md)
