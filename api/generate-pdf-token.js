const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { calculationId } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Verify user owns this calculation
    const { data: calc, error: calcError } = await supabase
      .from('calculations')
      .select('id')
      .eq('id', calculationId)
      .eq('user_id', user.id)
      .single();

    if (calcError || !calc) {
      return res.status(404).json({ error: 'Calculation not found or access denied' });
    }

    // Generate signed token (5 minute expiry)
    const pdfToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await supabase
      .from('pdf_tokens')
      .insert({
        token: pdfToken,
        calculation_id: calculationId,
        user_id: user.id,
        expires_at: expiresAt.toISOString()
      });

    res.status(200).json({
      token: pdfToken,
      download_url: `/api/report?token=${pdfToken}`,
      expires_at: expiresAt.toISOString()
    });

  } catch (err) {
    console.error('Token generation error:', err);
    res.status(500).json({ error: 'Failed to generate download token' });
  }
};


