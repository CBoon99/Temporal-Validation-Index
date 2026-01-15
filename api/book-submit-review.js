const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, review_text, rating, reviewer_title, entry_id } = req.body;
    
    if (!email || !review_text || !rating) {
      return res.status(400).json({ error: 'Email, review, and rating required' });
    }

    // Verify user was selected as winner
    const { data: entry, error: entryError } = await supabase
      .from('book_review_entries')
      .select('id, selected')
      .eq('email', email)
      .eq('selected', true)
      .single();

    if (entryError || !entry) {
      return res.status(403).json({ error: 'Only selected review copy winners can submit reviews' });
    }

    // Insert review
    const { data, error } = await supabase
      .from('book_reviews')
      .insert({
        entry_id: entry.id,
        email,
        name: name || 'Anonymous',
        review_text,
        rating,
        reviewer_title: reviewer_title || null,
        approved: false // Requires manual approval
      })
      .select()
      .single();

    if (error) {
      console.error('Review submission error:', error);
      return res.status(500).json({ error: 'Review submission failed' });
    }

    // Mark entry as review submitted
    await supabase
      .from('book_review_entries')
      .update({ review_submitted: true })
      .eq('id', entry.id);

    res.status(200).json({
      success: true,
      message: 'Review submitted successfully. Thank you!',
      review_id: data.id
    });

  } catch (err) {
    console.error('Review submission error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

