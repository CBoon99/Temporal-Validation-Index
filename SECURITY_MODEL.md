# TVI Platform Security & Monetization Model

**Status:** Hardened Production Model  
**Last Updated:** January 15, 2026

## 🔒 Security Architecture

### Server-Side Calculation Engine

**All TVI computation moved to `/api/tvi-run`**

The proprietary TVI formula, era coefficients, and classification thresholds are **never exposed to the browser**.

**Protected assets (server-only):**
- TVI calculation formula
- Era-based SRC values
- Legacy multipliers
- Domain weightings
- Classification thresholds
- A-Factor calculations
- Saturation index formulas (CSI, DSI, BSI, MSI)

**Client receives:** Only the calculated scores and classifications.

### Rate Limiting

**Unauthenticated (Preview Mode):**
- 3 calculations per IP per day
- Returns classification + band only
- No numeric scores
- No component breakdown
- No PDF downloads

**Authenticated Free:**
- 5 full calculations per day
- Full scores + components
- PDF downloads (signed URLs)
- JSON export
- Share functionality

**Pro Plan ($49/month):**
- Unlimited calculations
- API access (1,000 calls/day)
- Priority PDF generation
- Sensitivity analysis
- Historical tracking

### PDF Security

**Signed Expiring URLs (5-minute TTL)**

PDF downloads require:
1. Valid user session
2. Ownership of calculation
3. Time-limited signed token

Flow:
```
User clicks "Download PDF"
  ↓
Frontend calls /api/generate-pdf-token
  ↓
Backend verifies ownership, generates token
  ↓
Returns signed URL: /api/report?token=xxx
  ↓
Token valid for 5 minutes, single-use
  ↓
After use or expiry: token invalidated
```

**Protection against:**
- Direct URL access
- Link sharing
- Unauthorized downloads
- Replay attacks

### Authentication Flow

**Supabase Auth (Email/Password + Magic Link)**

- Session stored in browser (httpOnly cookies when deployed)
- Access token sent via Authorization header
- Refresh tokens handled by Supabase SDK
- RLS policies protect database access

**Preview experience without login:**
- Shows classification tier
- Hides numeric scores (blurred)
- Calls to action for signup
- No data persistence

### Terms of Service Protection

**Explicitly prohibits:**
- Reverse engineering the TVI engine
- Dataset extraction
- Automated scraping
- Formula replication
- Unauthorized redistribution

**Legal file:** `/terms.html`

## 💰 Monetization Gates

### Free Tier (5 calcs/day)
✅ Full TVI scores  
✅ Component breakdown  
✅ PDF downloads  
✅ JSON export  
❌ API access  
❌ Bulk operations  
❌ White-label reports  

### Pro Tier ($49/month, $490/year)
✅ Everything in Free  
✅ Unlimited calculations  
✅ API access (1,000/day)  
✅ Priority support  
✅ Data retention (unlimited)  
✅ Advanced analytics  

### Enterprise (Custom)
✅ Everything in Pro  
✅ White-label reports  
✅ Custom rate limits  
✅ Dedicated infrastructure  
✅ SLA guarantees  
✅ Custom integrations  

## 🛡️ IP Protection Strategy

### What's Protected
1. **TVI Engine:** Proprietary formula, patent-pending
2. **Era Coefficients:** Empirically derived, trade secret
3. **Domain Weightings:** Validated across datasets, confidential
4. **Classification Logic:** Research-backed thresholds
5. **Temporal Validation Framework:** Original methodology

### What's Public
1. **Concept:** "Temporal validation matters" (not patentable)
2. **High-level formula:** CSI × log(TVS+1) × SRC (structure only)
3. **Sample outputs:** Demonstration reports
4. **API interface:** Standard REST endpoints

### Enforcement
- Server-side-only computation
- Rate limiting prevents bulk extraction
- Terms prohibit reverse engineering
- API requires key authentication
- Usage logging for audit trail

## 📊 Abuse Prevention

### IP-Based Preview Limits
```sql
-- Table: preview_limits
-- Tracks anonymous calculations by IP
-- Auto-cleanup after 7 days
```

### User-Based Limits
```sql
-- Column: profiles.daily_runs
-- Reset daily via cron
-- Enforced before calculation
```

### API Key Limits
```sql
-- Table: api_keys
-- Tracks usage_count per key
-- Rate limit enforced per call
-- Revocable instantly
```

### Token Expiry
```sql
-- Table: pdf_tokens
-- 5-minute expiry
-- Single-use only
-- Auto-cleanup via cron
```

## 🚀 Deployment Security

### Environment Variables (Secrets)
```bash
SUPABASE_SERVICE_ROLE_KEY  # Server-only, never exposed
STRIPE_SECRET_KEY          # Server-only
STRIPE_WEBHOOK_SECRET      # Webhook validation
```

### Public Variables
```bash
NEXT_PUBLIC_SUPABASE_URL   # Safe to expose
NEXT_PUBLIC_SUPABASE_ANON_KEY  # RLS-protected
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Client-side checkout
```

### API Route Protection
- `/api/tvi-run` - Auth optional (preview vs full)
- `/api/report` - Requires signed token
- `/api/generate-pdf-token` - Requires auth + ownership
- `/api/checkout` - Requires auth
- `/api/webhook` - Signature verification

## 🧪 Testing Security

### Penetration Test Checklist
- [ ] Attempt direct `/api/report` access without token
- [ ] Try expired token
- [ ] Try another user's calculation ID
- [ ] Exceed rate limits (3 preview, 5 free)
- [ ] Attempt formula extraction via DevTools
- [ ] Test API without auth
- [ ] Try webhook without signature
- [ ] SQL injection attempts (Supabase parameterizes)
- [ ] XSS attempts (React/framework would sanitize, but check)

### Expected Behaviors
✅ Direct report access → 403 Forbidden  
✅ Expired token → 403 Expired  
✅ Wrong user → 404 Not Found  
✅ Rate limit exceeded → 429 + upgrade prompt  
✅ No formula visible in source → ✅  
✅ API without key → 401 Unauthorized  
✅ Invalid webhook → 400 Bad Signature  

## 📈 Monitoring & Alerts

### Watch For
- Unusual API call patterns (potential scraping)
- High preview-to-signup ratio (conversion issue)
- Failed auth attempts (brute force)
- Expired token usage spikes (link sharing)
- Rate limit violations (abuse)

### Alerts (Set up in Supabase/Vercel)
- >100 failed auth attempts/hour → Email
- >50 rate limit hits/hour → Slack
- Webhook signature failures → Immediately
- PDF generation failures → Daily digest

## 🔐 Compliance Notes

### GDPR (if applicable)
- User data minimization: only email, name, company
- Right to deletion: supported via Supabase
- Data portability: JSON export available
- Consent: Terms acceptance required

### CCPA (California)
- Do Not Sell: compliant (we don't sell data)
- Data access requests: supported
- Deletion requests: automated

### PCI DSS
- Payment processing: Stripe (PCI Level 1 compliant)
- No credit card data stored locally
- Webhook signatures verified

## 📝 Intellectual Property

### Trademark
"Temporal Validation Index" and "TVI" are trademarks of BoonMind Analytics.

### Copyright
All code, documentation, and methodology © 2026 BoonMind Analytics.

### Patent Status
Patent-pending on:
- Temporal validation framework for multi-domain impact measurement
- Era-adjusted saturation indices
- Cross-domain classification methodology

## 🎯 Competitive Moat

### Why This is Hard to Replicate

1. **Empirical Era Coefficients**
   - Derived from historical data analysis
   - Validated across 30+ years
   - Competitors would need years of research

2. **Domain-Specific Weightings**
   - Tuned across thousands of examples
   - Non-obvious (e.g., why adoption/1.5 for business?)
   - Trial-and-error = months of work

3. **Classification Thresholds**
   - Calibrated to human perception
   - Inter-rater validated
   - Not derivable from outputs alone

4. **Network Effects**
   - First-mover in temporal validation
   - Building canonical dataset (MNIST, Apple, Agile scores)
   - API ecosystem developing

## ⚠️ Known Risks & Mitigations

### Risk: Reverse Engineering
**Threat:** Users run many calculations, infer formula  
**Mitigation:** Rate limits + terms + obfuscated server code  
**Residual:** Low (would require 1000s of runs, still wouldn't get era coefficients)

### Risk: API Abuse
**Threat:** Scraping TVI scores for competitive dataset  
**Mitigation:** API keys + rate limits + usage monitoring  
**Residual:** Low (keys revocable, limits enforced)

### Risk: PDF Sharing
**Threat:** Users share download links  
**Mitigation:** 5-minute expiry + single-use tokens  
**Residual:** Very low (links break quickly)

### Risk: Formula Publication
**Threat:** Academic paper reveals methodology  
**Mitigation:** Patent filing + trade secret designation  
**Residual:** Moderate (academic work encouraged but doesn't expose implementation details)

## ✅ Security Checklist

Before going live:
- [ ] All calculation logic server-side only
- [ ] Environment variables configured
- [ ] Rate limits tested and working
- [ ] PDF tokens expire correctly
- [ ] Terms of Service published
- [ ] Webhook signature verification active
- [ ] RLS policies enabled in Supabase
- [ ] API keys working
- [ ] Preview mode hides sensitive data
- [ ] HTTPS enforced (Vercel automatic)
- [ ] CORS properly configured
- [ ] Error messages don't leak internals
- [ ] Logging configured for audit trail

---

**Result:** TVI engine is now a protected black-box API, not an open-source calculator.

Users get value. Formula stays proprietary. Business is defensible.

