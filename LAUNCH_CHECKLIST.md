# TVI Platform Launch Checklist

## ✅ Pre-Launch (Complete Before Deploy)

### Backend Infrastructure
- [ ] Supabase project created
- [ ] Database migrations run (001_init.sql, 002_api_keys.sql)
- [ ] Supabase Auth enabled (Email/Password)
- [ ] Row-level security policies tested
- [ ] Stripe account activated
- [ ] Stripe products created (Pro Monthly $49, Pro Yearly $490)
- [ ] Stripe webhook endpoint configured

### Code & Configuration
- [ ] `package.json` dependencies installed (`npm install`)
- [ ] `.env` file created from `env.template`
- [ ] All environment variables filled
- [ ] Vercel project linked
- [ ] Git repository initialized
- [ ] `.gitignore` excludes sensitive files

### Frontend
- [ ] Icons loading correctly (SVG, no emojis)
- [ ] Brand colors match BoonMind Studio
- [ ] Typography (Inter Tight / Inter / Space Mono) loading
- [ ] Mobile responsive tested
- [ ] All forms validate correctly
- [ ] Results display properly
- [ ] Login modal functional

## 🚀 Deployment Steps

### Step 1: Vercel Deployment
```bash
vercel --prod
```
- [ ] Deployment successful
- [ ] Custom domain configured (optional)
- [ ] Environment variables added in Vercel dashboard
- [ ] All secrets marked as "Secret"

### Step 2: Post-Deploy Configuration
- [ ] Update Supabase Auth site URL to Vercel domain
- [ ] Update Supabase redirect URLs
- [ ] Update Stripe webhook URL to production endpoint
- [ ] Test Stripe webhook delivery

### Step 3: Functionality Testing
- [ ] User signup works
- [ ] Email confirmation (if enabled)
- [ ] Login works
- [ ] Logout works
- [ ] Session persists on refresh

### Step 4: Calculator Testing
- [ ] Viral domain calculations work
- [ ] Datasets domain calculations work
- [ ] Business domain calculations work
- [ ] Investment domain calculations work
- [ ] Results display correctly
- [ ] Calculations save to database
- [ ] Components (CSI/TVS/SRC) display correctly

### Step 5: PDF & Downloads
- [ ] Sample report downloads work (login-gated)
- [ ] Downloads log to database
- [ ] PDF generation endpoint responds
- [ ] Dynamic PDFs include correct data
- [ ] PDF styling matches brand

### Step 6: Payments
- [ ] "Upgrade to Pro" button visible
- [ ] Stripe checkout session creates
- [ ] Redirect to Stripe works
- [ ] Test payment with Stripe test card
- [ ] Webhook updates user plan
- [ ] Pro badge shows in dashboard
- [ ] Free users see upgrade CTA

### Step 7: API
- [ ] API key generation works
- [ ] API keys display in dashboard
- [ ] `/api/tvi` endpoint responds
- [ ] API authentication works
- [ ] Rate limiting enforced
- [ ] API documentation accessible at `/api/docs.html`
- [ ] Example cURL requests work

### Step 8: Dashboard
- [ ] Dashboard loads user data
- [ ] Recent calculations display
- [ ] Download count shows
- [ ] API keys section works
- [ ] Plan status displays
- [ ] Links to calculator work

## 🔍 Quality Assurance

### Security
- [ ] No hardcoded secrets in code
- [ ] All API keys in environment variables
- [ ] Supabase RLS policies active
- [ ] API rate limiting works
- [ ] CORS configured properly
- [ ] Stripe webhook signature verified

### Performance
- [ ] Page load < 2 seconds
- [ ] Calculations complete < 500ms
- [ ] PDF generation < 5 seconds
- [ ] API response < 200ms
- [ ] Database queries optimized (indexes)

### UX
- [ ] No console errors
- [ ] Toast notifications work
- [ ] Loading states show
- [ ] Error messages clear
- [ ] Mobile layout works
- [ ] Smooth scroll anchors work
- [ ] Icons visible on dark background

## 📊 Launch Metrics Setup

### Analytics (Optional but Recommended)
- [ ] PostHog or Mixpanel installed
- [ ] Track: page_view, signup, calculation_run, download_pdf, upgrade
- [ ] Conversion funnel configured
- [ ] Dashboard KPIs defined

### Monitoring
- [ ] Vercel function logs accessible
- [ ] Supabase logs monitored
- [ ] Stripe dashboard checked daily
- [ ] Error alerting configured (email/Slack)

## 🎉 Go-Live Tasks

### Announcement
- [ ] Update BoonMind website with TVI link
- [ ] Social media posts scheduled
- [ ] Email announcement to beta users
- [ ] Product Hunt submission prepared

### Documentation
- [ ] README.md finalized
- [ ] DEPLOYMENT.md verified
- [ ] API docs tested with real examples
- [ ] FAQ or help section added

### Support
- [ ] Support email monitored (carl@boonmind.com)
- [ ] API support channel (api@boonmind.com)
- [ ] Response time SLA defined (<24hrs)

## 🐛 Post-Launch Monitoring (First 48 Hours)

- [ ] Check Vercel logs every 6 hours
- [ ] Monitor Supabase database growth
- [ ] Watch Stripe dashboard for payments
- [ ] Respond to user feedback immediately
- [ ] Fix critical bugs within 2 hours
- [ ] Note feature requests for v1.1

## 🎯 Success Criteria (First Week)

- [ ] 50+ user signups
- [ ] 200+ calculations run
- [ ] 20+ PDF downloads
- [ ] 3+ Pro upgrades
- [ ] 5+ API keys generated
- [ ] Zero critical bugs
- [ ] < 2% error rate

## 📈 Week 2+ Optimizations

- [ ] Review analytics data
- [ ] Optimize high-bounce pages
- [ ] A/B test upgrade CTA placement
- [ ] Add most-requested features
- [ ] Improve PDF templates based on feedback
- [ ] Expand API documentation
- [ ] Consider enterprise tier

---

**Ready to launch?** Run through this checklist twice before going live.

If any item is ✅, you're ready. If ❌, complete it first.

Good luck! 🚀

