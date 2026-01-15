# TVI Platform - Credentials Collection

**Your Domain:** TVI-Framework.com ✅

**Instructions:** Fill in this template after setting up Supabase and Stripe, then send to me (secure message).

---

## SUPABASE CREDENTIALS

**Project Setup:**
1. Go to https://supabase.com
2. Create new project → Name: `tvi-platform`
3. Run these SQL migrations in order (SQL Editor):
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_api_keys.sql`
   - `supabase/migrations/003_rate_limits.sql`
   - `supabase/migrations/004_newsletter.sql`

**Copy these from Settings → API:**

```
Project URL: https://_____________________.supabase.co
Anon Key (public): eyJhbG_____________________
Service Role Key (secret): eyJhbG_____________________
```

**Auth Settings:**
- Go to Authentication → URL Configuration
- Site URL: `https://TVI-Framework.com`
- Redirect URLs: `https://TVI-Framework.com/**`

---

## STRIPE CREDENTIALS (TEST MODE FIRST)

**Product Setup:**
1. Go to https://stripe.com → Stay in TEST MODE
2. Products → Add Product:
   
   **Product 1:**
   - Name: `TVI Pro Monthly`
   - Price: `$49.00 USD / month` (recurring)
   - Description: `Unlimited TVI calculations + API access`
   
   **Product 2:**
   - Name: `TVI Pro Yearly`
   - Price: `$490.00 USD / year` (recurring)
   - Description: `Unlimited TVI calculations + API access (save $98/year)`

3. Developers → Webhooks → Add endpoint:
   - URL: `https://TVI-Framework.com/api/webhook` (we'll update after deploy)
   - Events: `checkout.session.completed`, `customer.subscription.deleted`

**Copy these from Developers → API keys:**

```
Publishable Key (test): pk_test_____________________
Secret Key (test): sk_test_____________________
Webhook Signing Secret: whsec_____________________

Pro Monthly Price ID: price_____________________
Pro Yearly Price ID: price_____________________
```

---

## ANALYTICS (OPTIONAL)

**PostHog Setup:**
1. Go to https://posthog.com → Sign up (free)
2. Create project → Name: `TVI Platform`
3. Copy API key

```
PostHog API Key (optional): phc_____________________
```

**Or skip this:** Analytics won't track but site works fine.

---

## COPY THIS COMPLETED TEMPLATE

Once filled, copy and send to me via secure message:

```
=== SUPABASE ===
Project URL: https://xxxxx.supabase.co
Anon Key: eyJhbG...
Service Role Key: eyJhbG...

=== STRIPE (TEST MODE) ===
Publishable Key: pk_test_...
Secret Key: sk_test_...
Webhook Secret: whsec_...
Pro Monthly Price ID: price_...
Pro Yearly Price ID: price_...

=== ANALYTICS (OPTIONAL) ===
PostHog API Key: phc_...

=== DOMAIN ===
TVI-Framework.com ✅ (already configured)
```

---

## What I'll Do With These

### 1. Wire Frontend (5 min)
Update these files with your real keys:
- `Universal-Impact-Calculator-v1.0.1.html`
- `dashboard.html`

### 2. Create .env File (2 min)
With all your credentials (you'll add to Vercel)

### 3. Test Locally (3 min)
Verify everything connects

### 4. Generate Deploy Commands (2 min)
Exact Vercel commands with env vars

**Total:** ~12 minutes, then you're ready to deploy!

---

## After I Wire Everything

**You'll get:**
1. Updated HTML files (real Supabase/Stripe keys injected)
2. Complete `.env` file
3. Vercel deployment commands
4. Testing checklist

**Then you just:**
```bash
npm run deploy
# Add env vars to Vercel
# Update Stripe webhook URL
# Test
# Launch! 🚀
```

---

## Estimated Timeline

- **Now:** You setup Supabase (10 min) + Stripe (10 min)
- **Now + 20 min:** You send me credentials
- **Now + 32 min:** I wire everything
- **Now + 37 min:** You deploy to Vercel
- **Now + 47 min:** We test together
- **Now + 60 min:** Production launch ✅

**One hour from now, you could be live.**

---

## Questions?

**Stuck on Supabase?** I'll walk you through it step-by-step.  
**Stuck on Stripe?** I'll guide you.  
**Security concerns?** Keys stay secure (you control them).

**Ready to start?** Setup Supabase first (easiest), then Stripe, then send me the completed template above.

Let's do this! 🎯

