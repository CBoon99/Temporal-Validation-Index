-- Book review copy lottery entries
CREATE TABLE IF NOT EXISTS book_review_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  why_interested TEXT,
  bonus_entries INTEGER DEFAULT 0,
  total_entries INTEGER DEFAULT 1,
  twitter_shared BOOLEAN DEFAULT false,
  linkedin_shared BOOLEAN DEFAULT false,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES book_review_entries(id),
  selected BOOLEAN DEFAULT false,
  notified BOOLEAN DEFAULT false,
  entry_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_review_entries_email ON book_review_entries(email);
CREATE INDEX idx_review_entries_referral ON book_review_entries(referral_code);
CREATE INDEX idx_review_entries_selected ON book_review_entries(selected);

-- Book reviews from winners
CREATE TABLE IF NOT EXISTS book_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES book_review_entries(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  reviewer_title TEXT, -- e.g., "Investor", "AI Researcher"
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_book_reviews_approved ON book_reviews(approved);
CREATE INDEX idx_book_reviews_featured ON book_reviews(featured);

-- Function to select 10 random winners
CREATE OR REPLACE FUNCTION select_review_winners()
RETURNS TABLE(id UUID, email TEXT, name TEXT, entry_number INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Select 10 random entries weighted by total_entries
  RETURN QUERY
  WITH weighted_entries AS (
    SELECT 
      e.id,
      e.email,
      e.name,
      ROW_NUMBER() OVER (ORDER BY random() * e.total_entries DESC) as entry_number
    FROM book_review_entries e
    WHERE e.selected = false
    ORDER BY random() * e.total_entries DESC
    LIMIT 10
  )
  SELECT * FROM weighted_entries;
  
  -- Mark selected as true
  UPDATE book_review_entries
  SET selected = true, notified = false
  WHERE id IN (
    SELECT id FROM weighted_entries
  );
END;
$$;

-- Function to get entry stats
CREATE OR REPLACE FUNCTION get_lottery_stats()
RETURNS JSON
LANGUAGE sql
AS $$
  SELECT json_build_object(
    'total_entries', COUNT(*)::INTEGER,
    'total_people', COUNT(*)::INTEGER,
    'bonus_entries_granted', COALESCE(SUM(bonus_entries), 0)::INTEGER,
    'winners_selected', COUNT(*) FILTER (WHERE selected = true)::INTEGER,
    'reviews_submitted', (SELECT COUNT(*)::INTEGER FROM book_reviews WHERE approved = true)
  )
  FROM book_review_entries;
$$;


