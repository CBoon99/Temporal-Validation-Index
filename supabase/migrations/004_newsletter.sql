-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT, -- 'calculator', 'research', 'book', 'rate-limit', 'blog'
  interest TEXT, -- 'ai_data', 'business', 'invest', 'culture'
  plan TEXT DEFAULT 'none', -- Track if they later become users
  subscribed BOOLEAN DEFAULT true,
  confirmed BOOLEAN DEFAULT false,
  confirmation_token TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_source ON newsletter_subscribers(source);
CREATE INDEX idx_newsletter_subscribed ON newsletter_subscribers(subscribed);

-- No RLS needed (public signup)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);


