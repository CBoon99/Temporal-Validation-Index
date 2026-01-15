# TVI Platform Deployment Guide

## Prerequisites
- Supabase account
- Stripe account
- Vercel account
- Node.js 18+ installed

## Step-by-Step Deployment

### Phase 1: Supabase Setup (15 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note project URL and anon key

2. **Run Database Migrations**
   - Open SQL Editor in Supabase dashboard
   - Run `supabase/migrations/001_init.sql`
   - Run `supabase/migrations/002_api_keys.sql`

3. **Configure Authentication**
   - Enable Email/Password auth
   - Optional: Enable Magic Link
   - Set site URL to your domain

4. **Copy Keys**
   ```
   Project URL: https://xxxxx.supabase.co
   Anon key: eyJhbG...
   Service role key: eyJhbG... (keep secret!)
   ```

### Phase 2: Stripe Setup (10 minutes)

1. **Create Products**
   - Dashboard → Products → Create Product
   - **TVI Pro Monthly**: $49/month (recurring)
   - **TVI Pro Yearly**: $490/year (recurring)
   - Copy price IDs (price_...)

2. **Configure Webhook**
   - Developers → Webhooks → Add endpoint
   - URL: `https://your-domain.vercel.app/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`
   - Copy webhook secret (whsec_...)

3. **Get API Keys**
   ```
   Publishable key: pk_test_...
   Secret key: sk_test_...
   Webhook secret: whsec_...
   ```

### Phase 3: Local Setup (5 minutes)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp env.template .env
   ```

3. **Fill in Environment Variables**
   Edit `.env` with your Supabase and Stripe keys

4. **Test Locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

### Phase 4: Vercel Deployment (10 minutes)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Link Project**
   ```bash
   vercel link
   ```

3. **Add Environment Variables**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env`
   - Mark sensitive keys as "Secret"

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Update Stripe Webhook**
   - Replace webhook URL with your Vercel domain
   - Test webhook delivery

### Phase 5: Final Configuration (5 minutes)

1. **Update Supabase Auth URLs**
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs: `https://your-domain.vercel.app/**`

2. **Update Frontend Config**
   - Edit `index.html` and `dashboard.html`
   - Replace `window.SUPABASE_URL` and `window.SUPABASE_KEY` with your values
   - Or inject via script tag in production

3. **Test Complete Flow**
   - ✅ Sign up new user
   - ✅ Run TVI calculation
   - ✅ Download PDF report
   - ✅ Generate API key
   - ✅ Test API endpoint
   - ✅ Upgrade to Pro (test mode)

## Production Checklist

- [ ] Supabase project created and migrated
- [ ] Stripe products created (Pro Monthly & Yearly)
- [ ] Stripe webhook configured and tested
- [ ] Environment variables set in Vercel
- [ ] Domain configured (optional custom domain)
- [ ] Email notifications enabled (Supabase)
- [ ] Analytics tracking (optional: PostHog/Mixpanel)
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Test user signup/login flow
- [ ] Test PDF generation
- [ ] Test Stripe checkout
- [ ] Test API endpoint
- [ ] Monitor error logs (Vercel + Supabase)

## Monitoring

### Supabase Dashboard
- Users: Check `auth.users` table
- Calculations: Query `calculations` table
- Downloads: Monitor `downloads` table
- Revenue: Track `profiles.plan` upgrades

### Vercel Logs
- Function logs: API errors
- Analytics: Page views, deployments
- Performance: Response times

### Stripe Dashboard
- Revenue: Monthly recurring revenue
- Churn: Cancelled subscriptions
- Failed payments: Retry logic

## Troubleshooting

### "Supabase client not initialized"
- Check environment variables in Vercel
- Verify keys are correct
- Check browser console for errors

### "PDF generation failed"
- Playwright requires serverless-friendly config
- Check Vercel function timeout (increase if needed)
- Verify calculation data exists in database

### "Stripe webhook not working"
- Verify webhook secret matches Vercel env var
- Check Stripe dashboard webhook logs
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`

### "API rate limit issues"
- Current implementation is simple (usage_count)
- For production: Use Redis (Upstash) for real rate limiting
- Or implement token bucket algorithm

## Next Steps

1. **Custom Domain**
   - Add in Vercel dashboard
   - Update Supabase/Stripe URLs

2. **Email Notifications**
   - Enable Supabase Auth emails
   - Custom templates with TVI branding

3. **Analytics**
   - Add PostHog or Mixpanel
   - Track: signups, calculations, downloads, upgrades

4. **Enhanced PDFs**
   - Add charts/visualizations
   - White-label templates for enterprise

5. **Mobile App**
   - React Native using same TVI API
   - Supabase auth works cross-platform

## Support

Technical issues: carl@boonmind.com
API questions: api@boonmind.com

