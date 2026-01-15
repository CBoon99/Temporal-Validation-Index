# TVI Platform - Temporal Validation Index

**Universal staying power measurement system for culture, data, and economics.**

🔒 **Hardened Production Model** - Proprietary calculation engine protected by server-side execution, rate limiting, and signed URLs.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Run migrations in `/supabase/migrations/` in order
3. Copy project URL and keys

### 3. Set Up Stripe
1. Create products at [stripe.com](https://stripe.com):
   - **Pro Monthly**: $49/month
   - **Pro Yearly**: $490/year
2. Copy product price IDs
3. Configure webhook endpoint: `https://your-domain.com/api/webhook`

### 4. Configure Environment
Copy `env.template` to `.env` and fill in:
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

### 5. Deploy to Vercel
```bash
vercel --prod
```

Add environment variables in Vercel dashboard.

## 📁 Project Structure

```
/
├── index.html              # Main calculator app
├── dashboard.html          # User dashboard
├── /api/
│   ├── report.js          # PDF generation (Playwright)
│   ├── tvi.js             # Public TVI API
│   ├── checkout.js        # Stripe checkout session
│   ├── webhook.js         # Stripe webhooks
│   └── docs.html          # API documentation
├── /supabase/
│   ├── migrations/
│   │   ├── 001_init.sql   # Core tables
│   │   └── 002_api_keys.sql
│   └── config.js
├── /assets/icons/         # SVG icons
└── /reports/              # Sample PDFs
```

## 🎯 Features

### Security & IP Protection
- ✅ Server-side calculation engine (formula never exposed)
- ✅ Preview mode for unauthenticated users (classification only)
- ✅ Rate limiting (3 preview/IP, 5 full/day free, unlimited Pro)
- ✅ Signed PDF URLs with 5-minute expiry
- ✅ Terms of Service with IP protection
- ✅ Abuse prevention & monitoring

### Core Features
- ✅ Real Supabase authentication
- ✅ Calculation persistence & logging
- ✅ Dynamic PDF generation (Playwright)
- ✅ Stripe payments (Pro plan $49/mo)
- ✅ Public API with authentication
- ✅ User dashboard with history
- ✅ API key management

## 🔑 API Usage

Generate API key from dashboard, then:

```bash
curl -X POST https://your-domain.com/api/tvi \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tvi_your_key" \
  -d '{
    "domain": "viral",
    "inputs": {
      "year": 2007,
      "views": 880000000,
      "users": 200000000,
      "c": 3.0,
      "p": 180,
      "r": 0.5,
      "legacy": 2.5
    }
  }'
```

Full documentation: `/api/docs.html`

## 💳 Pricing

- **Free**: 5 calculations/month, basic exports
- **Pro**: $49/month - Unlimited calculations, PDF reports, API access (1000 calls/day)
- **Enterprise**: Custom - White-label, dedicated support, unlimited API

## 🛠️ Development

```bash
# Local development
npm run dev

# Deploy
npm run deploy
```

## 📊 Success Metrics

- Users can sign up/login
- Calculations persist to database
- PDFs generate dynamically
- Stripe checkout functional
- API documented and live

## 📬 Contact

- Email: carl@boonmind.com
- Website: boonmind.com
- API Support: api@boonmind.com

---

**BoonMind Analytics** • Temporal Validation Index v1.0.1

