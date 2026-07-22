# Part H — Monitoring (Q46–Q50)

[← Back to Index](00-INDEX.md)

---

<a id="q46"></a>
## Q46 — Which logs do you check first during an incident? ⭐

### Thought process
Start where **user impact** is visible, then walk the path with correlation IDs.

### Answer — order

1. **Edge / API gateway / ingress** — status codes, latency, upstream errors  
2. **Application logs** of the failing service — exceptions, filtered by `trace_id` / `request_id`  
3. **Dependency errors** — Mongo, Redis, HTTP clients (timeout messages)  
4. **Platform** — Kubernetes events (OOMKilled, FailedScheduling), node logs if needed  
5. **Deploy / CI audit** — what changed  

Prefer **structured JSON logs** with level, service, version, tenant, trace_id.

### Common follow-ups
- DEBUG in production — when is it OK?
- Log sampling / PII redaction?

### What not to say
- Dumping entire unfiltered DEBUG logs as first move.
- Ignoring gateway and jumping into random pods.

---

<a id="q47"></a>
## Q47 — Which metrics do you monitor in production? ⭐

### Answer — tiers

**Golden signals (per service/endpoint)**  
Latency (p50/p95/p99), traffic (RPS), errors (5xx rate), saturation (CPU, memory, pools, queue depth)

**Node.js specific**  
Event loop delay, GC pause, heap used, active handles

**Data stores**  
Query latency, connections, replication lag, cache hit ratio, evictions

**Business / SLI**  
Checkout success rate, login success, job completion lag

**Infra**  
Disk, network, certificate expiry, HPA replica count

### Common follow-ups
- RED vs USE methods?
- High-cardinality metric pitfalls?

### What not to say
- Only infrastructure CPU/memory with no request metrics.

---

<a id="q48"></a>
## Q48 — How do Prometheus and Grafana help in debugging?

### Answer

- **Prometheus** scrapes/stores time-series metrics; PromQL answers “when/how much.”  
- **Grafana** visualizes dashboards & alerts on those metrics.  

**During incidents:** overlay deploy annotations; compare time ranges; correlate RPS vs latency vs DB CPU; confirm whether autoscaling reacted.

**Limits:** metrics lack full request context — pair with logs/traces. Avoid high-cardinality labels (`user_id` on metrics).

### Common follow-ups
- Pull vs push models?
- Recording rules / exemplars linking to traces?

### What not to say
- Claiming Prometheus replaces logging and tracing.

---

<a id="q49"></a>
## Q49 — What alerts would you configure for an API service? ⭐

### Thought process
Alert on **symptoms users feel** + a few **cause** alerts. Page sparingly.

### Answer — practical alert set

| Alert | Why |
|-------|-----|
| High 5xx rate (burn SLO) | User-visible failure |
| p95/p99 latency burn | Slow UX |
| Saturation: CPU, memory near limit | Leading indicator |
| Event loop lag high (Node) | App stuck |
| DB connection pool wait / errors | Common outage mode |
| Dependency error rate / circuit open | Cascades |
| Pod restart / OOMKill rate | Instability |
| Queue lag / consumer down | Async backlog |
| Certificate expiry (days ahead) | Planned |

**Good practice:** multi-window burn-rate alerts (Google SRE), runbooks linked, severity tiers (page vs ticket).

### Common follow-ups
- How do you avoid alert fatigue?
- Symptom vs cause alerts?

### What not to say
- Alerting on every metric spike with no SLO.
- Paging on CPU 60% briefly.

---

<a id="q50"></a>
## Q50 — How do distributed tracing tools help? ⭐

### Answer

They show **where time is spent across services** for a single request:
- Critical path / longest span  
- Fan-out parallelism  
- Retry loops  
- DB/cache spans  

Tools: Jaeger, Zipkin, Tempo, Datadog APM, New Relic, Elastic APM — often via **OpenTelemetry**.

**Together with metrics/logs:** metrics detect, traces explain, logs detail errors.

### Common follow-ups
- Head vs tail sampling?
- How do you trace async messaging (Kafka)?

### What not to say
- Tracing alone without metrics for detection.

---

[← Back to Index](00-INDEX.md) · [Next: Load Testing →](09-load-testing.md)
