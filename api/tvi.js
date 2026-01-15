const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'Missing API key' });
    }

    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id, rate_limit, last_used')
      .eq('key', apiKey)
      .eq('active', true)
      .single();

    if (keyError || !keyData) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    // Rate limiting check (simple: 100 calls per day for free, 1000 for Pro)
    const { data: user } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', keyData.user_id)
      .single();

    const limit = user?.plan === 'pro' ? 1000 : 100;
    const today = new Date().toISOString().split('T')[0];
    const lastUsed = keyData.last_used?.split('T')[0];
    
    // Simple rate limit (would need Redis for production)
    // For now, just update last_used
    await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString(), usage_count: (keyData.usage_count || 0) + 1 })
      .eq('key', apiKey);

    // Parse request
    const { domain, inputs } = req.body;
    
    if (!domain || !inputs) {
      return res.status(400).json({ error: 'Missing domain or inputs' });
    }

    // Calculate TVI
    const result = calculateTVI(domain, inputs);
    
    res.status(200).json(result);

  } catch (err) {
    console.error('TVI API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function calculateTVI(domain, inputs) {
  const NOW = new Date().getFullYear();
  
  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
  function getSRC(year) {
    if (year <= 2004) return 3;
    if (year <= 2009) return 2.5;
    if (year <= 2013) return 2;
    if (year <= 2017) return 1.5;
    return 1;
  }
  function classify(score, domain) {
    if (domain === 'invest') {
      if (score < 5) return 'Ephemeral Hype';
      if (score < 20) return 'Trend Riding';
      if (score < 50) return 'Validated';
      return 'Foundation';
    }
    if (score < 1) return 'Ephemeral';
    if (score < 5) return 'Viral Moment';
    if (score < 15) return 'Cultural Event';
    if (score < 30) return 'Milestone';
    if (score < 50) return 'Foundation';
    return 'Phenomenon';
  }

  let score, type, components;

  if (domain === 'viral') {
    const { year, views, users, c = 1, p = 0, r = 0, legacy = 1 } = inputs;
    const yearsOld = NOW - year;
    const aFactor = year >= 2005 ? (yearsOld < 1 ? 1.1 : yearsOld < 5 ? 1.5 : yearsOld < 10 ? 2 : yearsOld < 15 ? 2.3 : 2.5) : 1;
    const CSI = (views / aFactor) / users * c;
    const TVS = p * r * legacy;
    const SRC = getSRC(year);
    score = CSI * Math.log10(TVS + 1) * SRC;
    type = 'TVI';
    components = [
      { label: 'CSI', value: CSI.toFixed(2) },
      { label: 'TVS', value: TVS.toFixed(1) },
      { label: 'SRC', value: SRC },
      { label: 'A-Factor', value: aFactor.toFixed(2) },
      { label: 'C', value: c.toFixed(1) }
    ];
  } else if (domain === 'datasets') {
    const { year, usage, researchers, c = 1, p = 0, r = 0, legacy = 1 } = inputs;
    const DSI = (usage / 2) / researchers * c;
    const TVS = p * r * legacy;
    const SRC = getSRC(year);
    score = DSI * Math.log10(TVS + 1) * SRC;
    type = 'TDIS';
    components = [
      { label: 'DSI', value: DSI.toFixed(1) },
      { label: 'TVS', value: TVS.toFixed(1) },
      { label: 'SRC', value: SRC },
      { label: 'C', value: c.toFixed(1) }
    ];
  } else if (domain === 'business') {
    const { year, adoption, market, c = 1, p = 0, r = 0, legacy = 1 } = inputs;
    const BSI = (adoption / 1.5) / market * c;
    const TVS = p * r * legacy;
    const SRC = getSRC(year);
    score = BSI * Math.log10(TVS + 1) * SRC;
    type = 'TVI-B';
    components = [
      { label: 'BSI', value: BSI.toFixed(2) },
      { label: 'TVS', value: TVS.toFixed(1) },
      { label: 'SRC', value: SRC },
      { label: 'C', value: c.toFixed(1) }
    ];
  } else if (domain === 'invest') {
    const { year, brand, position, era = 1, sus, crisis, leadership } = inputs;
    const MSI = (brand * position) / Math.max(0.1, era) * 100;
    const TVS = sus * crisis * leadership;
    const SRC = getSRC(year);
    score = MSI * Math.log10(TVS + 1) * SRC;
    type = 'ISPS';
    components = [
      { label: 'MSI', value: MSI.toFixed(1) },
      { label: 'TVS', value: TVS.toFixed(1) },
      { label: 'SRC', value: SRC }
    ];
  } else {
    return { error: 'Invalid domain' };
  }

  return {
    score: parseFloat(score.toFixed(1)),
    type,
    classification: classify(score, domain),
    components,
    timestamp: new Date().toISOString()
  };
}
