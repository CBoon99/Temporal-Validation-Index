const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get remaining copies
    const { data: remaining, error } = await supabase.rpc('get_remaining_copies');
    
    if (error) {
      return res.status(500).json({ error: 'Unable to fetch stats' });
    }

    const claimed = 100 - (remaining || 100);
    const soldOut = remaining <= 0;

    // Also get lottery entry count
    const { data: lotteryStats } = await supabase.rpc('get_lottery_stats');
    const totalEntries = lotteryStats?.total_entries || 0;

    res.status(200).json({
      total: 100,
      claimed,
      remaining,
      soldOut,
      price: soldOut ? 39.95 : 19.95,
      edition: soldOut ? 'founding' : 'founding',
      total_entries: totalEntries
    });

  } catch (err) {
    console.error('Book stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

