const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, source, interest } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, subscribed')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.subscribed) {
        return res.status(200).json({ 
          success: true, 
          message: 'Already subscribed',
          already_subscribed: true 
        });
      } else {
        // Re-subscribe
        await supabase
          .from('newsletter_subscribers')
          .update({ 
            subscribed: true, 
            subscribed_at: new Date().toISOString(),
            source: source || 'unknown'
          })
          .eq('id', existing.id);
        
        return res.status(200).json({ 
          success: true, 
          message: 'Re-subscribed successfully' 
        });
      }
    }

    // New subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        name: name || null,
        source: source || 'unknown',
        interest: interest || null,
        subscribed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Newsletter signup error:', error);
      return res.status(500).json({ error: 'Subscription failed' });
    }

    // TODO: Send confirmation email via Supabase email or SendGrid

    res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed',
      subscriber_id: data.id
    });

  } catch (err) {
    console.error('Newsletter signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

