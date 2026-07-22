# Backend Interview Handbook

> Debugging · Performance · Production · Scalability · Database · Caching · Node.js · Microservices · Monitoring · Load Testing · Security · System Design · Workplace Scenarios

**How to use this handbook**
1. Skim the index and jump to a question via its marker (`Q01`, `Q02`, …).
2. For each answer, read in this order: **Thought process → Answer → Example → Follow-ups → What not to say**.
3. Scenario questions include a **STAR** frame (Situation · Task · Action · Result).
4. Practice out loud in 2–3 minutes per question; use follow-ups for deep dives.

---

## Quick legend

| Tag | Meaning |
|-----|---------|
| 🔧 | Hands-on debugging / ops |
| 📐 | Design / architecture |
| ⭐ | Commonly asked in mid–senior interviews |
| 🗣️ | STAR scenario answer |

---

## Part A — Debugging & Performance

| # | Question | Link |
|---|----------|------|
| Q01 ⭐🔧 | How would you debug a slow API? | [→](01-debugging-performance.md#q01) |
| Q02 ⭐ | Once you identify the bottleneck, how would you improve API performance? | [→](01-debugging-performance.md#q02) |
| Q03 ⭐🔧 | How do you investigate high response times in production? | [→](01-debugging-performance.md#q03) |
| Q04 ⭐🔧 | API was fine yesterday, now takes 10 seconds — troubleshoot? | [→](01-debugging-performance.md#q04) |
| Q05 ⭐ | Frontend vs backend vs DB vs network — how do you isolate? | [→](01-debugging-performance.md#q05) |
| Q06 ⭐ | What metrics do you check first when an app becomes slow? | [→](01-debugging-performance.md#q06) |
| Q07 ⭐🔧 | How do you identify memory leaks in Node.js? | [→](01-debugging-performance.md#q07) |
| Q08 🔧 | How do you debug high CPU utilization? | [→](01-debugging-performance.md#q08) |
| Q09 🔧 | How do you debug an application that crashes randomly? | [→](01-debugging-performance.md#q09) |
| Q10 ⭐ | How would you optimize a database query? | [→](01-debugging-performance.md#q10) |

## Part B — Production Issues

| # | Question | Link |
|---|----------|------|
| Q11 ⭐🗣️ | Deployed a new version; users report errors — what do you do? | [→](02-production-issues.md#q11) |
| Q12 ⭐🗣️ | Production bug cannot be reproduced locally | [→](02-production-issues.md#q12) |
| Q13 ⭐ | Works locally but not in production | [→](02-production-issues.md#q13) |
| Q14 🗣️ | Customer reports intermittent failures | [→](02-production-issues.md#q14) |
| Q15 ⭐🗣️ | Service starts returning 500 errors | [→](02-production-issues.md#q15) |
| Q16 ⭐ | Suddenly 10x traffic — what happens and how do you handle it? | [→](02-production-issues.md#q16) |
| Q17 🔧 | How would you investigate an OOM error? | [→](02-production-issues.md#q17) |
| Q18 ⭐ | Steps when debugging a production issue | [→](02-production-issues.md#q18) |

## Part C — Scalability

| # | Question | Link |
|---|----------|------|
| Q19 ⭐📐 | Scale an API from 100 rps to 10,000 rps | [→](03-scalability.md#q19) |
| Q20 📐 | Millions of users — what changes? | [→](03-scalability.md#q20) |
| Q21 ⭐ | How would you reduce load on the database? | [→](03-scalability.md#q21) |
| Q22 📐 | Design for peak traffic | [→](03-scalability.md#q22) |
| Q23 ⭐ | Horizontal vs vertical scaling | [→](03-scalability.md#q23) |
| Q24 | Prevent a single API from becoming a bottleneck | [→](03-scalability.md#q24) |

## Part D — Database

| # | Question | Link |
|---|----------|------|
| Q25 ⭐🔧 | MongoDB query suddenly slow — what do you check? | [→](04-database.md#q25) |
| Q26 ⭐ | How do you optimize database performance? | [→](04-database.md#q26) |
| Q27 | What causes database locks? | [→](04-database.md#q27) |
| Q28 ⭐ | How do you decide which fields to index? | [→](04-database.md#q28) |
| Q29 | When should you avoid creating indexes? | [→](04-database.md#q29) |
| Q30 ⭐ | How would you reduce the number of database calls? | [→](04-database.md#q30) |

## Part E — Caching

| # | Question | Link |
|---|----------|------|
| Q31 ⭐ | When would you use Redis? | [→](05-caching.md#q31) |
| Q32 ⭐ | How do you decide what should be cached? | [→](05-caching.md#q32) |
| Q33 ⭐ | What problems can caching introduce? | [→](05-caching.md#q33) |
| Q34 ⭐ | Cache invalidation — what is it and how do you handle it? | [→](05-caching.md#q34) |
| Q35 ⭐ | If Redis goes down, what happens to your application? | [→](05-caching.md#q35) |

## Part F — Node.js

| # | Question | Link |
|---|----------|------|
| Q36 ⭐🔧 | Debug Node.js with high memory usage | [→](06-nodejs.md#q36) |
| Q37 ⭐ | How do you prevent blocking the event loop? | [→](06-nodejs.md#q37) |
| Q38 ⭐ | Common causes of event loop blocking | [→](06-nodejs.md#q38) |
| Q39 🔧 | How would you profile a Node.js application? | [→](06-nodejs.md#q39) |
| Q40 ⭐ | How do you handle CPU-intensive tasks in Node.js? | [→](06-nodejs.md#q40) |

## Part G — Microservices

| # | Question | Link |
|---|----------|------|
| Q41 ⭐🔧 | One microservice is slow — find the root cause | [→](07-microservices.md#q41) |
| Q42 | Debug communication between microservices | [→](07-microservices.md#q42) |
| Q43 ⭐ | Trace a request across multiple services | [→](07-microservices.md#q43) |
| Q44 ⭐ | Handle failures between services | [→](07-microservices.md#q44) |
| Q45 ⭐ | What if one service is unavailable? | [→](07-microservices.md#q45) |

## Part H — Monitoring

| # | Question | Link |
|---|----------|------|
| Q46 ⭐ | Which logs do you check first during an incident? | [→](08-monitoring.md#q46) |
| Q47 ⭐ | Which metrics do you monitor in production? | [→](08-monitoring.md#q47) |
| Q48 | How do Prometheus and Grafana help in debugging? | [→](08-monitoring.md#q48) |
| Q49 ⭐ | What alerts would you configure for an API service? | [→](08-monitoring.md#q49) |
| Q50 ⭐ | How do distributed tracing tools help? | [→](08-monitoring.md#q50) |

## Part I — Load Testing

| # | Question | Link |
|---|----------|------|
| Q51 ⭐ | How many users can the application support? | [→](09-load-testing.md#q51) |
| Q52 ⭐ | How would you conduct a load test? | [→](09-load-testing.md#q52) |
| Q53 | What metrics do you analyze after a load test? | [→](09-load-testing.md#q53) |
| Q54 | Response times increase gradually under load — why? | [→](09-load-testing.md#q54) |
| Q55 | Identify the bottleneck during a stress test | [→](09-load-testing.md#q55) |

## Part J — Security

| # | Question | Link |
|---|----------|------|
| Q56 ⭐ | How do you secure a REST API? | [→](10-security.md#q56) |
| Q57 ⭐ | Prevent SQL / NoSQL injection | [→](10-security.md#q57) |
| Q58 | How do you prevent DDoS attacks? | [→](10-security.md#q58) |
| Q59 ⭐ | How would you secure sensitive data? | [→](10-security.md#q59) |
| Q60 ⭐ | How do you authenticate APIs? | [→](10-security.md#q60) |

## Part K — System Design

| # | Question | Link |
|---|----------|------|
| Q61 ⭐📐 | Design a URL Shortener | [→](11-system-design.md#q61) |
| Q62 ⭐📐 | Design a Chat Application | [→](11-system-design.md#q62) |
| Q63 📐 | Design a Notification Service | [→](11-system-design.md#q63) |
| Q64 📐 | Design an Online Quiz Platform | [→](11-system-design.md#q64) |
| Q65 📐 | Design a File Upload Service | [→](11-system-design.md#q65) |
| Q66 ⭐📐 | Design a Rate Limiter | [→](11-system-design.md#q66) |
| Q67 📐 | Design a Payment Processing Service | [→](11-system-design.md#q67) |
| Q68 📐 | Design a Real-time Dashboard | [→](11-system-design.md#q68) |

## Part L — Real Workplace Scenarios

| # | Question | Link |
|---|----------|------|
| Q69 ⭐🗣️ | Manager says API is slow; you cannot reproduce it | [→](12-workplace-scenarios.md#q69) |
| Q70 🗣️ | Two developers blame each other's code | [→](12-workplace-scenarios.md#q70) |
| Q71 ⭐🗣️ | Your deployment caused failures — how do you recover? | [→](12-workplace-scenarios.md#q71) |
| Q72 ⭐🗣️ | Database CPU at 100% — immediate steps | [→](12-workplace-scenarios.md#q72) |
| Q73 🗣️ | Users complain about slow page loads | [→](12-workplace-scenarios.md#q73) |
| Q74 ⭐ | Third-party API is timing out — how do you handle it? | [→](12-workplace-scenarios.md#q74) |
| Q75 🗣️ | Logs show no errors; users still report failures | [→](12-workplace-scenarios.md#q75) |
| Q76 🔧 | Memory leak only after several hours | [→](12-workplace-scenarios.md#q76) |
| Q77 | One API call suddenly uses much more CPU | [→](12-workplace-scenarios.md#q77) |
| Q78 ⭐🗣️ | 50 ms in dev, 5 seconds in production | [→](12-workplace-scenarios.md#q78) |

---

## Universal interview framework (use on every question)

```text
1. Clarify scope & SLOs (latency? error rate? which endpoint? since when?)
2. Observe   → metrics, logs, traces, recent changes
3. Isolate   → FE / BE / DB / network / dependency
4. Hypothesize → 1–2 likely causes, not ten
5. Validate  → experiment / query / reproduce with evidence
6. Mitigate  → stop the bleeding (rollback, scale, circuit break)
7. Fix       → permanent fix + tests + alert
8. Learn     → postmortem / runbook update
```

## Answer structure cheat sheet

| Section | Purpose |
|---------|---------|
| **Thought process** | Show structured thinking before jumping to tools |
| **Answer** | Concrete steps, tools, trade-offs |
| **Example** | Node.js / MongoDB / Redis / K8s / JMeter story |
| **Follow-ups** | Anticipate interviewer depth |
| **What not to say** | Avoid junior traps and red flags |
| **STAR** | For incident / people / judgment questions |

---

**Files in this handbook**

| File | Contents |
|------|----------|
| [00-INDEX.md](00-INDEX.md) | This index |
| [01-debugging-performance.md](01-debugging-performance.md) | Q01–Q10 |
| [02-production-issues.md](02-production-issues.md) | Q11–Q18 |
| [03-scalability.md](03-scalability.md) | Q19–Q24 |
| [04-database.md](04-database.md) | Q25–Q30 |
| [05-caching.md](05-caching.md) | Q31–Q35 |
| [06-nodejs.md](06-nodejs.md) | Q36–Q40 |
| [07-microservices.md](07-microservices.md) | Q41–Q45 |
| [08-monitoring.md](08-monitoring.md) | Q46–Q50 |
| [09-load-testing.md](09-load-testing.md) | Q51–Q55 |
| [10-security.md](10-security.md) | Q56–Q60 |
| [11-system-design.md](11-system-design.md) | Q61–Q68 |
| [12-workplace-scenarios.md](12-workplace-scenarios.md) | Q69–Q78 |
