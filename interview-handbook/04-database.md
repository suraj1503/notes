# Part D — Database (Q25–Q30)

[← Back to Index](00-INDEX.md)

---

<a id="q25"></a>
## Q25 — MongoDB query suddenly becomes slow. What will you check? ⭐🔧

### Thought process
Sudden ⇒ change in plan, data volume, resources, or locks — not “Mongo is bad.”

### Answer — checklist

1. **`explain("executionStats")`** — COLLSCAN? bad index chosen?  
2. **Slow query log / Profiler** (`db.setProfilingLevel`)  
3. **Data growth** — collection size, cardinality change  
4. **Index health** — missing, unused, or wrong compound order; index build in progress  
5. **`currentOp`** — long ops, `waitingForLock`, yield  
6. **Hardware / shared noisy neighbor** — disk IO, CPU  
7. **Replication lag** if reading secondaries  
8. **Changed query shape** — new filter from app deploy  
9. **Write load / WiredTiger cache pressure**  
10. **Working set** no longer fits RAM  

### Real-world example
Query used to hit `{ status: 1, createdAt: -1 }` index. New filter added `tenantId` first in the query but index lacked `tenantId` → scanned huge `{status}` range. Fixed compound `{ tenantId: 1, status: 1, createdAt: -1 }`.

### Common follow-ups
- ESR rule for compound indexes?
- How do you roll indexes with zero downtime?

### What not to say
- Immediately sharding.
- Dropping random indexes without explain.

---

<a id="q26"></a>
## Q26 — How do you optimize database performance? ⭐

### Thought process
Workload-driven: schema + queries + indexes + resources + architecture.

### Answer — layers

1. **Query & index design** (biggest wins)  
2. **Schema** aligned to access patterns (embed vs reference)  
3. **Caching** hot keys  
4. **Connection management**  
5. **Hardware / storage IO**, WiredTiger cache  
6. **Horizontal**: replicas, sharding when needed  
7. **Operational hygiene**: archive cold data, compact, monitor  

### Metrics to watch
Ops/sec, latency, scanned vs returned, cache hit, replication lag, page faults / IO wait.

### Common follow-ups
- Normalization vs denormalization in Mongo?
- Transactions impact on performance?

### What not to say
- Only “buy a bigger server.”

---

<a id="q27"></a>
## Q27 — What causes database locks?

### Thought process
Show you understand concurrency control (Mongo WiredTiger document-level vs relational table/row locks).

### Answer

**General causes**
- Long-running transactions holding locks  
- Hot document / row updates (high contention)  
- DDL / index builds (varies by engine & version)  
- Full collection/table scans competing with writers  
- Uncommitted transactions / idle-in-transaction  
- Foreign key checks / range locks (SQL)  

**MongoDB notes**
- WiredTiger: document-level concurrency; still see stalls from cache eviction, journaling, or multi-doc transactions  
- `currentOp` waiting states; avoid huge multi-doc txns  

**Mitigations**
- Short transactions; idempotent retries; queue serialization for hot keys; optimistic concurrency (`version` field)

### Common follow-ups
- Optimistic vs pessimistic locking?
- How do you detect lock waits in Postgres vs Mongo?

### What not to say
- “MongoDB never locks.”

---

<a id="q28"></a>
## Q28 — How do you decide which fields should be indexed? ⭐

### Thought process
Index for **real query predicates + sort + join keys**, guided by frequency and selectivity.

### Answer — decision rules

Index a field / compound when:
1. Used often in `find` / `match` filters  
2. Used in `sort` with filter (compound)  
3. High **selectivity** (many distinct values) relative to query  
4. Supports uniqueness constraints (`unique`)  
5. Foreign / reference lookups (`userId`, `orderId`)  

**Compound design:** Equality fields → Sort fields → Range fields (ESR).

**Process:** collect top queries from logs → explain → create → measure write impact → remove unused indexes.

### Common follow-ups
- Partial / sparse / TTL indexes?
- Covered queries?

### What not to say
- Index every field “just in case.”

---

<a id="q29"></a>
## Q29 — When should you avoid creating indexes?

### Answer — avoid / be careful when

1. **Write-heavy, rarely queried** fields — indexes slow inserts/updates  
2. **Low selectivity** fields (`boolean`, `status` with 2 values) **alone** — little benefit; OK as prefix in compound with selective fields  
3. **Small collections** — collection scan may be fine  
4. **Fields always returning most of the collection**  
5. **Highly mutable unique fields** causing constant index updates  
6. **Too many overlapping indexes** — optimizer confusion + RAM waste  

### Common follow-ups
- How many indexes is too many?
- Index intersection vs compound index?

### What not to say
- “Indexes are free.”

---

<a id="q30"></a>
## Q30 — How would you reduce the number of database calls? ⭐

### Thought process
Round trips kill latency more than people expect (especially N+1).

### Answer

1. **Batch** — `$in`, multi-get, DataLoader pattern  
2. **Join / aggregate** once instead of loops  
3. **Embed** related data when read together (Mongo)  
4. **Cache** repeated reads  
5. **BFF / GraphQL** field resolvers batched  
6. **Denormalize** carefully for read models  
7. **Pipeline** updates that need read-modify-write into a single atomic op (`findOneAndUpdate`)  

### Real-world example
Order API: 1 query for order + N for line items + N for products → aggregation `$lookup` or stored embedded snapshot of product name/price at purchase time (1 read).

### Common follow-ups
- DataLoader vs manual batching?
- Consistency trade-offs of denormalization?

### What not to say
- “Put everything in one giant document forever.”

---

[← Back to Index](00-INDEX.md) · [Next: Caching →](05-caching.md)
