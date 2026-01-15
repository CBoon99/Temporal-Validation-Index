# TVI Platform - Pre-Launch Setup Guide

**Your Question:** Should I set up databases first, then push live?

**Answer:** YES — Much smarter to configure everything before deployment.

---

## Optimal Launch Sequence

### Phase 1: Setup Backends (You Do This - 20 min)
### Phase 2: Give Me Credentials (5 min)
### Phase 3: I Wire Everything (10 min)
### Phase 4: You Deploy (5 min)
### Phase 5: We Test Together (10 min)

**Total:** ~50 minutes from start to production

---

## PHASE 1: YOU — Setup Supabase & Stripe (20 minutes)

### Step 1A: Create Supabase Project (10 min)

1. **Go to:** https://supabase.com
2. **Create new project:**
   - Name: `tvi-platform` (or whatever you want)
   - Database password: (save this!)
   - Region: Choose closest to your users
   - Plan: Free tier is fine for launch

3. **Wait 2-3 minutes** for project to initialize

4. **Run Database Migrations:**
   - Click "SQL Editor" in left sidebar
   - Create new query
   - Copy/paste contents of `supabase/migrations/001_init.sql`
   - Click "Run"
   - Repeat for `002_api_keys.sql`
   - Repeat for `003_rate_limits.sql`
   - All should show "Success"

5. **Copy Your Keys:**
   - Go to Settings → API
   - Copy these (I'll need them):
     - **Project URL:** `https://xxxxx.supabase.co`
     - **anon public key:** `eyJhbG...` (starts with eyJ)
     - **service_role key:** `eyJhbG...` (different, also starts with eyJ)

---

### Step 1B: Setup Stripe Products (10 min)

1. **Go to:** https://stripe.com
2. **Create account** or log in
3. **Stay in TEST MODE** (toggle in top right) for now

4. **Create Products:**
   - Products → "+ Add product"
   
   **Product 1:**
   - Name: `TVI Pro Monthly`
   - Description: `Unlimited TVI calculations + API access`
   - Pricing: `$49.00 USD` / `Recurring` / `Monthly`
   - Click "Save product"
   - **Copy the Price ID:** `price_xxxxx` (you'll see it on the product page)
   
   **Product 2:**
   - Name: `TVI Pro Yearly`
   - Description: `Unlimited TVI calculations + API access (17% discount)`
   - Pricing: `$490.00 USD` / `Recurring` / `Yearly`
   - Click "Save product"
   - **Copy the Price ID:** `price_yyyyy`

5. **Configure Webhook** (we'll update URL later):
   - Developers → Webhooks → "+ Add endpoint"
   - Endpoint URL: `https://PLACEHOLDER.com/api/webhook` (we'll update after deploy)
   - Events to send: 
     - `checkout.session.completed`
     - `customer.subscription.deleted`
   - Click "Add endpoint"
   - **Copy Signing Secret:** `whsec_xxxxx`

6. **Copy Your Keys:**
   - Developers → API keys
   - **Publishable key:** `pk_test_xxxxx`
   - **Secret key:** `sk_test_xxxxx` (click "Reveal test key")

---

## PHASE 2: YOU → GIVE ME (Copy/Paste Here)

Create a text file or message with:

```
SUPABASE CREDENTIALS:
Project URL: https://xxxxx.supabase.co
Anon Key: eyJhbG...
Service Role Key: eyJhbG...

STRIPE CREDENTIALS (TEST MODE):
Publishable Key: pk_test_xxxxx
Secret Key: sk_test_xxxxx
Webhook Secret: whsec_xxxxx
Pro Monthly Price ID: price_xxxxx
Pro Yearly Price ID: price_yyyyy

OPTIONAL:
Custom domain you want to use: (e.g., tvi.boonmind.com)
or
Use Vercel default: your-project.vercel.app
```

**Security Note:** Share via:
- Secure 1:1 message (not public)
- Or I'll help you add them directly to Vercel (you stay in control)

---

## PHASE 3: ME — Wire Everything (10 minutes)

Once you give me credentials, I will:

### 1. Update Frontend Config
**Files I'll modify:**
- `Universal-Impact-Calculator-v1.0.1.html` (replace Supabase placeholders)
- `dashboard.html` (add Stripe publishable key)

**What I'll add:**
```html
<script>
  window.SUPABASE_URL = 'https://YOUR-ACTUAL-PROJECT.supabase.co';
  window.SUPABASE_KEY = 'eyJhbG...your-actual-anon-key';
  window.STRIPE_PUBLISHABLE_KEY = 'pk_test_...your-actual-key';
</script>
```

### 2. Create .env File
**File I'll create:** `.env`

**Contents:**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_YEARLY_PRICE_ID=price_...

APP_URL=http://localhost:3000
```

### 3. Verify All Endpoints Reference Correct Keys
**Files I'll check:**
- All `/api/*.js` files use `process.env.SUPABASE_URL`
- No hardcoded keys anywhere
- .gitignore includes `.env`

---

## PHASE 4: YOU — Deploy to Vercel (5 minutes)

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Link project
vercel link

# Add environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... (paste each one when prompted)

# Deploy
vercel --prod
```

### Option B: Vercel Dashboard

1. **Import project:**
   - Go to https://vercel.com
   - New Project → Import Git Repository
   - Connect GitHub → select `tvi-platform` repo

2. **Add environment variables:**
   - Settings → Environment Variables
   - Add all variables from `.env` file
   - Mark sensitive ones as "Secret"

3. **Deploy:**
   - Deployments → Deploy
   - Wait ~2 minutes

4. **Get your URL:**
   - Will be something like `tvi-platform-xxxxx.vercel.app`

---

## PHASE 5: WE — Test Everything Together (10 minutes)

### I'll Guide You Through:

**Test 1: Preview Mode (No Login)**
```
1. Visit your Vercel URL
2. Select a domain (e.g., AI & Data)
3. Fill in sample data
4. Click "Calculate TVI"
Expected: Classification shown, score blurred, "Create account" overlay
```

**Test 2: Signup**
```
1. Click "Create Free Account"
2. Enter email + password
3. Should receive confirmation
Expected: Logged in, can see full scores
```

**Test 3: Full Calculation**
```
1. Run a calculation while logged in
Expected: Full score, components, drivers shown
Check: Calculation appears in Supabase dashboard → calculations table
```

**Test 4: Rate Limits**
```
1. Run 5 calculations
2. Try a 6th
Expected: 429 error, "Upgrade to Pro" prompt
```

**Test 5: PDF Generation**
```
1. After a calculation, click "Download PDF"
Expected: Token generated, PDF downloads
Check: downloads table in Supabase has entry
```

**Test 6: Stripe Checkout**
```
1. Click "Upgrade to Pro"
2. Use Stripe test card: 4242 4242 4242 4242
3. Complete checkout
Expected: Redirected back, plan = 'pro' in Supabase
```

**Test 7: Webhook**
```
1. Check Stripe dashboard → Webhooks
2. Should show successful delivery
Expected: User plan updated in profiles table
```

**Test 8: Research Pages**
```
1. Visit /research/index.html
2. Click through all 7 pages
Expected: All pages load, navigation works
```

### If Any Test Fails:
- I'll see the error logs (Vercel dashboard → Functions → Logs)
- We'll fix it together in real-time
- Usually just an env var typo or webhook URL

---

## PHASE 6: Go Live (Post-Testing)

### Update Stripe Webhook URL

Once Vercel gives you the production URL:

1. Stripe Dashboard → Developers → Webhooks
2. Click your webhook
3. Update Endpoint URL to: `https://your-actual-vercel-url.app/api/webhook`
4. Save

### Switch to Production Mode (When Ready)

1. Stripe: Toggle to "Production mode"
2. Create real products (same $49/$490)
3. Get production keys
4. Update Vercel env vars with production keys
5. Redeploy

---

## What I Need From You (Exact Format)

**Just copy/paste this template filled in:**

```
=== SUPABASE ===
Project URL: 
Anon Key: 
Service Role Key: 

=== STRIPE (TEST MODE) ===
Publishable Key: 
Secret Key: 
Webhook Secret: 
Pro Monthly Price ID: 
Pro Yearly Price ID: 

=== DEPLOYMENT ===
Preferred domain: (e.g., tvi.boonmind.com or use Vercel default)
```

**Where I'll add them:**
- Frontend: Inject via `<script>` tags (I'll show you where)
- Backend: Create `.env` file (you'll add to Vercel)
- Vercel: I'll give you the exact `vercel env add` commands

---

## Why This Order Works

### If You Deploy First (❌ Harder):
1. Site goes live with placeholder keys
2. Nothing works
3. You add real keys to Vercel
4. Redeploy
5. Still might have issues
6. Debug in production (stressful)

### If You Setup First (✅ Easier):
1. Backends configured
2. I wire the real keys
3. Deploy once
4. Everything works immediately
5. We test together
6. Fix any issues before "public"

---

## Current Status

**Your current folder:**
- ✅ All code complete (55 files)
- ✅ No secrets exposed (placeholders only)
- ✅ Ready to receive real keys
- ✅ .gitignore protecting .env
- ✅ All migrations ready to run

**You're at the perfect stopping point.**

Do Supabase + Stripe setup (20 min), give me the keys, I'll wire them, you deploy once, done.

---

## Timeline Estimate

**Today:**
- 9:00 AM: You start Supabase setup
- 9:10 AM: Supabase done, migrations run
- 9:15 AM: Stripe products created
- 9:20 AM: You send me credentials
- 9:25 AM: I wire everything + create .env
- 9:30 AM: You deploy to Vercel
- 9:35 AM: Site live, we start testing
- 9:45 AM: All tests passed
- 9:50 AM: Production ready

**2-Hour Buffer:** ~12:00 PM production launch

---

## Ready?

**Your next action:**
1. Create Supabase project
2. Run the 3 SQL migrations
3. Create Stripe products
4. Copy the credentials template above
5. Send to me
6. I'll wire everything

**Then:** Deploy once, test, launch. ✅

Want me to walk you through Supabase setup step-by-step, or are you good to go?
