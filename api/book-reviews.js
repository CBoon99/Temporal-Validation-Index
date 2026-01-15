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
    // Get approved and featured reviews only
    const { data: reviews, error } = await supabase
      .from('book_reviews')
      .select('name, review_text, rating, reviewer_title, submitted_at')
      .eq('approved', true)
      .order('featured', { ascending: false })
      .order('rating', { ascending: false })
      .limit(10);

    if (error) {
      return res.status(500).json({ error: 'Unable to fetch reviews' });
    }

    res.status(200).json(reviews || []);

  } catch (err) {
    console.error('Reviews fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

