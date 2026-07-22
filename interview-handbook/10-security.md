# Part J — Security (Q56–Q60)

[← Back to Index](00-INDEX.md)

---

<a id="q56"></a>
## Q56 — How do you secure a REST API? ⭐

### Thought process
Defense in depth: identity, abuse, data, transport, supply chain.

### Answer — checklist

1. **TLS everywhere** (HTTPS); HSTS at edge  
2. **Authentication** (OAuth2/OIDC, JWT, API keys for M2M)  
3. **Authorization** — RBAC/ABAC; never trust client roles alone  
4. **Input validation** — schema (Joi/Zod), allowlists  
5. **Output encoding** / careful error messages (no stack traces to clients)  
6. **Rate limiting** & bot protection  
7. **CORS** least privilege  
8. **Security headers** (API gateways / Helmet for Express)  
9. **Dependency scanning** + secret management  
10. **Audit logs** for sensitive actions  
11. **Least-privilege DB credentials**  
12. **Pagination limits** / payload size limits  

### Common follow-ups
- JWT storage (browser) risks?
- mTLS for service-to-service?

### What not to say
- “We use JWT so we’re secure” with no authz story.
- Rolling your own crypto.

---

<a id="q57"></a>
## Q57 — Prevent SQL Injection or NoSQL Injection ⭐

### Answer

**SQL**
- Parameterized queries / prepared statements  
- ORM bind parameters  
- Never string-concatenate user input into SQL  
- Least-privilege DB user  

**NoSQL (MongoDB)**
- Avoid passing raw request objects into queries (`req.body` → query)  
- Validate types (reject keys like `$gt`, `$where`)  
- Use allowlisted filters  
- Disable / avoid `$where` and server-side JS  
- Libraries that sanitize operator injection  

### Example (bad vs good)
```js
// BAD — operator injection
db.users.find({ email: req.body.email }) // email: { "$ne": null }

// BETTER
const email = String(req.body.email);
if (!isValidEmail(email)) throw badRequest();
db.users.find({ email });
```

### Common follow-ups
- ORM still injectable?
- How do you test for injection?

### What not to say
- “Mongo can’t be injected.”
- Blacklist-only filters for `$`.

---

<a id="q58"></a>
## Q58 — How do you prevent DDoS attacks?

### Thought process
You rarely “prevent” fully — you **absorb, detect, shed**.

### Answer — layers

1. **CDN / cloud scrubbing** (Cloudflare, AWS Shield)  
2. **Rate limiting** at edge & API  
3. **WAF** rules for known bad patterns  
4. **Autoscaling** with cost controls  
5. **Syntactic protections** — connection limits, request size limits, timeouts  
6. **Cache** static/cacheable GETs at edge  
7. **Anomaly alerts** on RPS / unique IPs  
8. **Degradation** — disable expensive endpoints under attack  

Application-level rate limits alone won’t stop volumetric network floods — need edge/network providers.

### Common follow-ups
- Volumetric vs application-layer (L7) attacks?
- Cost attacks (expensive API abuse)?

### What not to say
- “Firewall on the Node server is enough.”

---

<a id="q59"></a>
## Q59 — How would you secure sensitive data? ⭐

### Answer

1. **Classify data** (PII, secrets, payment, health)  
2. **Minimize** collection & retention  
3. **Encrypt in transit** (TLS) and **at rest** (disk/KMS)  
4. **Application-level encryption** for highly sensitive fields  
5. **Tokenize** payments (don’t store PAN; use Stripe etc.)  
6. **Secrets** in vault/KMS — never in git  
7. **Access control** & audit  
8. **Mask in logs**; scrub APM payloads  
9. **Key rotation**  
10. **Compliance** awareness (GDPR, PCI-DSS scope reduction)

### Common follow-ups
- Envelope encryption?
- How do you search encrypted fields?

### What not to say
- Logging passwords “temporarily.”
- Encrypting without key management story.

---

<a id="q60"></a>
## Q60 — How do you authenticate APIs? ⭐

### Answer — common patterns

| Method | Typical use |
|--------|-------------|
| **OIDC / OAuth2** (JWT access tokens) | User-facing apps |
| **API keys** | Simple M2M; rotate & scope |
| **mTLS** | Service mesh / high trust M2M |
| **HMAC signed requests** | Webhooks (Stripe-style) |
| **Session cookies** | Browser first-party (with CSRF protections) |

**JWT practices:** short expiry, validate `iss`/`aud`/`exp`, asymmetric keys preferred, revoke via short TTL + blocklist if needed, never store secrets in JWT payload.

**Always pair with authorization** on each resource.

### Common follow-ups
- Refresh token rotation?
- Opaque tokens vs JWT?

### What not to say
- Long-lived JWTs with all permissions and no revocation story.
- API key in query string logged everywhere.

---

[← Back to Index](00-INDEX.md) · [Next: System Design →](11-system-design.md)
