# Part E — Caching (Q31–Q35)

[← Back to Index](00-INDEX.md)

---

<a id="q31"></a>
## Q31 — When would you use Redis? ⭐

### Thought process
Redis is not “a faster Mongo.” Name **use cases**.

### Answer — strong fit use cases

| Use case | Why Redis |
|----------|-----------|
| **Session store** | Fast TTL keys |
| **Response / object cache** | Cut DB load |
| **Rate limiting** | Atomic INCR + TTL |
| **Distributed locks** | SET NX PX (with care) |
| **Leaderboards** | Sorted sets |
| **Pub/Sub / Streams** | Lightweight messaging |
| **Job queues** (Bull/BullMQ) | Lists/streams |
| **Idempotency keys** | Short-lived dedupe |
| **Feature flags / config** | Fast reads |

Avoid as primary system of record for critical durable business data unless you accept Redis persistence model & ops.

### Common follow-ups
- Redis Cluster vs Sentinel?
- Persistence AOF vs RDB?

### What not to say
- “Replace Mongo with Redis.”

---

<a id="q32"></a>
## Q32 — How do you decide what should be cached? ⭐

### Thought process
Cache when **read-heavy**, **expensive to compute/fetch**, and **tolerates staleness** (or has clear invalidation).

### Answer — decision rubric

Cache if:
1. High read:write ratio  
2. Stable or slowly changing  
3. Expensive (join, aggregation, remote API)  
4. Clear key design (`user:{id}:profile`)  
5. Acceptable TTL / invalidation strategy exists  

Do **not** cache (naively):
- Highly personalized every-ms changing data without strategy  
- Sensitive data without encryption/access controls  
- Tiny ultra-cheap queries (overhead > benefit)  
- Data with strict read-after-write unless you handle it  

**Also measure:** hit ratio; if < ~50–70% on a hot path, revisit keys/TTL.

### Common follow-ups
- What TTL would you choose?
- Cache at CDN vs Redis vs in-process?

### What not to say
- “Cache everything.”

---

<a id="q33"></a>
## Q33 — What problems can caching introduce? ⭐

### Answer — classic problems

1. **Stale data** — users see old values  
2. **Cache stampede / thundering herd** — TTL expiry → DB slam  
3. **Cache penetration** — queries for missing keys bypass to DB  
4. **Cache avalanche** — many keys expire together  
5. **Inconsistency** across nodes / regions  
6. **Memory pressure / eviction** of hot keys  
7. **Debugging opacity** — “works after 5 minutes”  
8. **Security** — caching private responses incorrectly  
9. **Idempotency bugs** if caching POST responses wrongly  

### Mitigations (name a few)
Soft TTL + probabilistic early refresh; single-flight locks; cache negative lookups briefly; jittered TTLs; explicit invalidation on writes.

### Common follow-ups
- How do you debug stale cache in prod?
- Redis eviction policies?

### What not to say
- Pretending caching has no consistency cost.

---

<a id="q34"></a>
## Q34 — Cache invalidation — what is it and how would you handle it? ⭐

### Thought process
Invalidation = making sure cache doesn’t serve **known-stale** data after a write.

### Answer — strategies

| Strategy | How | Pros | Cons |
|----------|-----|------|------|
| **TTL only** | Expire after N seconds | Simple | Stale window |
| **Write-through** | Write cache + DB together | Fresher | Write latency |
| **Write-behind** | Async persist | Fast writes | Durability risk |
| **Cache-aside + delete on write** | App deletes key after DB update | Common, clear | Race conditions |
| **Pub/Sub invalidation** | Publish “key changed” | Multi-instance | Complexity |
| **Versioned keys** | `user:42:v7` | Avoids delete races | Old keys until TTL |

**Practical pattern (Node + Redis):**
1. Read: get → miss → DB → set with TTL  
2. Write: update DB → `DEL` key (or bump version)  
3. Protect stampede with lock / single-flight  

### Common follow-ups
- Race: read fills cache with old value after delete?
- Multi-key invalidation (related objects)?

### What not to say
- “Invalidation is impossible so we never cache.” (Too absolute; discuss trade-offs.)

---

<a id="q35"></a>
## Q35 — If Redis goes down, what happens to your application? ⭐

### Thought process
This tests **resilience design**. Answer depends on how you integrated Redis — say that explicitly.

### Answer — design for degradation

**Bad design:** Redis required on every request with no fallback → full outage.

**Good design:**
1. **Cache-aside:** on Redis errors, fall back to DB (with circuit breaker + maybe serve stale if you have soft state)  
2. **Rate limiter in Redis:** fail-open vs fail-closed policy (business decision)  
3. **Sessions in Redis:** users logged out / sticky fallback — plan secondary store  
4. **Queue in Redis:** workers pause; producers buffer or reject  
5. **Alert + HA:** Sentinel/Cluster; multi-AZ  

**Interview line:** “Redis is an optimization/state store with an explicit failure mode: we degrade, protect the DB from stampede, and alert.”

### Real-world example
When Redis blipped, app stampeded Mongo. Added circuit breaker: if Redis error rate high, temporarily skip cache reads **and** apply in-memory short TTL + request coalescing; shed non-critical traffic.

### Common follow-ups
- Fail-open vs fail-closed for auth/rate limits?
- How do you prevent DB overload during Redis outage?

### What not to say
- “Nothing happens, Redis always works.”
- Hard dependency with no story.

---

[← Back to Index](00-INDEX.md) · [Next: Node.js →](06-nodejs.md)
