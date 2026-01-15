const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Extract customer email and metadata
      const customerEmail = session.customer_email || session.customer_details?.email;
      const priceId = session.line_items?.data[0]?.price?.id || session.metadata?.price_id;
      
      // Determine plan from price ID
      let plan = 'pro';
      let planInterval = 'monthly';
      if (priceId === process.env.STRIPE_PRO_YEARLY_PRICE_ID) {
        planInterval = 'yearly';
      }

      // Find user by email
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (userData) {
        // Update user plan
        await supabase
          .from('profiles')
          .update({ 
            plan, 
            plan_interval: planInterval,
            stripe_customer_id: session.customer,
            updated_at: new Date().toISOString()
          })
          .eq('id', userData.id);

        console.log(`✅ Updated user ${customerEmail} to ${plan} (${planInterval})`);
      } else {
        console.warn(`⚠️ User not found for email: ${customerEmail}`);
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      
      // Downgrade user to free
      await supabase
        .from('profiles')
        .update({ 
          plan: 'free',
          plan_interval: null,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', subscription.customer);

      console.log(`✅ Downgraded customer ${subscription.customer} to free`);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};
