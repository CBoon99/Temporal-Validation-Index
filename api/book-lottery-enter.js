const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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
    const { email, name, why_interested, referral_code } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    // Check if already entered
    const { data: existing } = await supabase
      .from('book_review_entries')
      .select('id, total_entries')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(200).json({ 
        success: true,
        message: 'Already entered',
        entries: existing.total_entries,
        already_entered: true
      });
    }

    // Generate unique referral code
    const newReferralCode = crypto.randomBytes(4).toString('hex');
    
    // Check if referred by someone
    let referredBy = null;
    if (referral_code) {
      const { data: referrer } = await supabase
        .from('book_review_entries')
        .select('id')
        .eq('referral_code', referral_code)
        .single();
      
      if (referrer) {
        referredBy = referrer.id;
        // Give referrer +2 bonus entries
        await supabase
          .from('book_review_entries')
          .update({ 
            bonus_entries: supabase.raw('bonus_entries + 2'),
            total_entries: supabase.raw('total_entries + 2')
          })
          .eq('id', referrer.id);
      }
    }

    // Insert new entry
    const { data, error } = await supabase
      .from('book_review_entries')
      .insert({
        email,
        name: name || null,
        why_interested: why_interested || null,
        referral_code: newReferralCode,
        referred_by: referredBy,
        total_entries: 1
      })
      .select()
      .single();

    if (error) {
      console.error('Lottery entry error:', error);
      return res.status(500).json({ error: 'Entry failed' });
    }

    // Get updated stats
    const { data: stats } = await supabase.rpc('get_lottery_stats');

    res.status(200).json({
      success: true,
      message: 'Entry confirmed',
      entries: 1,
      referral_code: newReferralCode,
      stats: stats || { total_entries: 1 }
    });

  } catch (err) {
    console.error('Lottery entry error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

