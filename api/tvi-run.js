const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { domain, inputs } = req.body;
    
    if (!domain || !inputs) {
      return res.status(400).json({ error: 'Missing domain or inputs' });
    }

    // Check auth token
    const authHeader = req.headers.authorization;
    const isAuthenticated = authHeader && authHeader.startsWith('Bearer ');
    let userId = null;
    let userPlan = 'free';
    let previewMode = false;

    if (isAuthenticated) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (!authError && user) {
        userId = user.id;
        
        // Get user plan
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan, daily_runs')
          .eq('id', userId)
          .single();
        
        userPlan = profile?.plan || 'free';
        const dailyRuns = profile?.daily_runs || 0;
        
        // Rate limit for free users
        if (userPlan === 'free' && dailyRuns >= 5) {
          return res.status(429).json({ 
            error: 'Daily limit reached',
            message: 'Free accounts are limited to 5 calculations per day. Upgrade to Pro for unlimited access.',
            upgrade_url: '/dashboard.html'
          });
        }
        
        // Increment daily run count
        await supabase
          .from('profiles')
          .update({ daily_runs: dailyRuns + 1 })
          .eq('id', userId);
          
      } else {
        previewMode = true;
      }
    } else {
      previewMode = true;
      
      // IP-based rate limiting for previews
      const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
      const today = new Date().toISOString().split('T')[0];
      
      const { data: ipLimits } = await supabase
        .from('preview_limits')
        .select('count')
        .eq('ip', clientIP)
        .eq('date', today)
        .single();
      
      if (ipLimits && ipLimits.count >= 3) {
        return res.status(429).json({ 
          error: 'Preview limit reached',
          message: 'You have reached the maximum of 3 preview calculations. Create a free account for 5 full calculations per day.',
          signup_url: '/?signup=true'
        });
      }
      
      // Increment preview count
      await supabase
        .from('preview_limits')
        .upsert({ 
          ip: clientIP, 
          date: today, 
          count: (ipLimits?.count || 0) + 1 
        }, { onConflict: 'ip,date' });
    }

    // Calculate TVI (SERVER-SIDE ONLY)
    const result = calculateTVI(domain, inputs, previewMode);
    
    // Log calculation if authenticated
    if (userId) {
      const { data: calcData } = await supabase
        .from('calculations')
        .insert({
          user_id: userId,
          domain,
          inputs,
          outputs: result,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (calcData) {
        result.calculation_id = calcData.id;
      }
    }
    
    res.status(200).json(result);

  } catch (err) {
    console.error('TVI calculation error:', err);
    res.status(500).json({ error: 'Calculation failed', details: err.message });
  }
};

// ============= TVI CALCULATION ENGINE (PROPRIETARY) =============
function calculateTVI(domain, inputs, previewMode = false) {
  const NOW = new Date().getFullYear();
  
  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
  
  // Era-based Structural Resistance Coefficient (SRC)
  function getSRC(year) {
    if (year <= 2004) return 3.0;
    if (year <= 2009) return 2.5;
    if (year <= 2013) return 2.0;
    if (year <= 2017) return 1.5;
    return 1.0;
  }
  
  // Classification thresholds
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
  
  function getBand(score) {
    if (score < 1) return 'Ephemeral';
    if (score < 5) return 'Moment';
    if (score < 15) return 'Event';
    if (score < 30) return 'Milestone';
    if (score < 50) return 'Foundation';
    return 'Phenomenon';
  }

  let score, saturation, validation, resistance, components, drivers;

  if (domain === 'viral' || domain === 'culture') {
    const { year, views, users, c = 1, p = 0, r = 0, legacy = 1 } = inputs;
    const yearsOld = NOW - year;
    const aFactor = year >= 2005 ? (yearsOld < 1 ? 1.1 : yearsOld < 5 ? 1.5 : yearsOld < 10 ? 2 : yearsOld < 15 ? 2.3 : 2.5) : 1;
    
    const CSI = (views / aFactor) / users * c;
    const TVS = p * r * legacy;
    const SRC = getSRC(year);
    
    score = CSI * Math.log10(TVS + 1) * SRC;
    saturation = CSI;
    validation = TVS;
    resistance = SRC;
    
    components = previewMode ? null : {
      CSI: parseFloat(CSI.toFixed(2)),
      TVS: parseFloat(TVS.toFixed(1)),
      SRC,
      'A-Factor': parseFloat(aFactor.toFixed(2)),
      C: c
    };
    
    drivers = previewMode ? null : [
      `Contextual saturation of ${CSI.toFixed(2)} indicates ${CSI > 1 ? 'exceptional' : CSI > 0.1 ? 'strong' : 'limited'} audience penetration for its era.`,
      `Temporal validation score of ${TVS.toFixed(1)} reflects ${TVS > 100 ? 'sustained cultural embedding' : TVS > 50 ? 'proven longevity' : 'limited temporal proof'}.`,
      `Structural resistance coefficient of ${SRC} accounts for the ${SRC >= 2.5 ? 'pre-algorithm' : SRC >= 1.5 ? 'early-algorithm' : 'algorithm-dominated'} era.`
    ];
    
  } else if (domain === 'datasets' || domain === 'ai') {
    const { year, usage, researchers, c = 1, p = 0, r = 0, legacy = 1 } = inputs;
    
    const DSI = (usage / 2) / researchers * c;
    const TVS = p * r * legacy;
    const SRC = getSRC(year);
    
    score = DSI * Math.log10(TVS + 1) * SRC;
    saturation = DSI;
    validation = TVS;
    resistance = SRC;
    
    components = previewMode ? null : {
      DSI: parseFloat(DSI.toFixed(1)),
      TVS: parseFloat(TVS.toFixed(1)),
      SRC,
      C: c
    };
    
    drivers = previewMode ? null : [
      `Dataset saturation index of ${DSI.toFixed(1)} indicates ${DSI > 100 ? 'widespread' : DSI > 10 ? 'significant' : 'limited'} adoption relative to research community.`,
      `Temporal validation of ${TVS.toFixed(1)} demonstrates ${TVS > 200 ? 'foundation-tier' : TVS > 50 ? 'validated' : 'emerging'} staying power.`,
      `Era coefficient ${SRC} reflects ${SRC >= 2.5 ? 'pre-deep learning' : SRC >= 1.5 ? 'early deep learning' : 'modern ML'} structural conditions.`
    ];
    
  } else if (domain === 'business') {
    const { year, adoption, market, c = 1, p = 0, r = 0, legacy = 1 } = inputs;
    
    const BSI = (adoption / 1.5) / market * c;
    const TVS = p * r * legacy;
    const SRC = getSRC(year);
    
    score = BSI * Math.log10(TVS + 1) * SRC;
    saturation = BSI;
    validation = TVS;
    resistance = SRC;
    
    components = previewMode ? null : {
      BSI: parseFloat(BSI.toFixed(2)),
      TVS: parseFloat(TVS.toFixed(1)),
      SRC,
      C: c
    };
    
    drivers = previewMode ? null : [
      `Business saturation of ${BSI.toFixed(2)} shows ${BSI > 1 ? 'significant' : BSI > 0.5 ? 'moderate' : 'limited'} market penetration.`,
      `Validation score ${TVS.toFixed(1)} indicates ${TVS > 200 ? 'management canon' : TVS > 100 ? 'proven standard' : 'emerging framework'} status.`,
      `Resistance factor ${SRC} accounts for competitive landscape of the ${SRC >= 2.5 ? 'pre-digital' : SRC >= 1.5 ? 'early-digital' : 'modern'} era.`
    ];
    
  } else if (domain === 'invest') {
    const { year, brand, position, era = 1, sus, crisis, leadership } = inputs;
    
    const MSI = (brand * position) / Math.max(0.1, era) * 100;
    const TVS = sus * crisis * leadership;
    const SRC = getSRC(year);
    
    score = MSI * Math.log10(TVS + 1) * SRC;
    saturation = MSI;
    validation = TVS;
    resistance = SRC;
    
    components = previewMode ? null : {
      MSI: parseFloat(MSI.toFixed(1)),
      TVS: parseFloat(TVS.toFixed(1)),
      SRC
    };
    
    drivers = previewMode ? null : [
      `Market saturation of ${MSI.toFixed(1)} reflects ${MSI > 5000 ? 'dominant' : MSI > 1000 ? 'strong' : 'emerging'} market position.`,
      `Temporal validation ${TVS.toFixed(1)} demonstrates ${TVS > 400 ? 'exceptional' : TVS > 200 ? 'proven' : 'developing'} competitive staying power.`,
      `Era resistance ${SRC} acknowledges founding in a ${SRC >= 2.5 ? 'pre-venture' : SRC >= 1.5 ? 'early-stage' : 'mature'} capital environment.`
    ];
  }

  const classification = classify(score, domain);
  const band = getBand(score);
  
  if (previewMode) {
    return {
      preview: true,
      classification,
      band,
      interpretation: getInterpretation(band),
      message: 'Create a free account to see your full TVI score, component breakdown, drivers, and downloadable report.'
    };
  }

  return {
    score: parseFloat(score.toFixed(1)),
    classification,
    band,
    saturation: parseFloat(saturation.toFixed(2)),
    validation: parseFloat(validation.toFixed(1)),
    resistance,
    components,
    drivers,
    timestamp: new Date().toISOString()
  };
}

function getInterpretation(band) {
  const interpretations = {
    'Ephemeral': 'Lacks temporal validation. Likely to fade quickly.',
    'Moment': 'Brief cultural visibility without sustained validation.',
    'Event': 'Significant at the time; limited long-term staying power.',
    'Milestone': 'Remembered across years with moderate temporal validation.',
    'Foundation': 'Proven staying power; forms lasting infrastructure.',
    'Phenomenon': 'Permanent cultural/structural significance.'
  };
  return interpretations[band] || 'Analysis pending.';
}

