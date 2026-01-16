-- Book purchases tracking
CREATE TABLE IF NOT EXISTS book_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  copy_number INTEGER UNIQUE NOT NULL,
  edition TEXT DEFAULT 'founding',
  price DECIMAL(10,2) DEFAULT 19.95,
  stripe_payment_id TEXT UNIQUE,
  pdf_downloaded BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  last_download_at TIMESTAMPTZ,
  purchase_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_book_purchases_email ON book_purchases(email);
CREATE INDEX idx_book_purchases_copy_number ON book_purchases(copy_number);
CREATE INDEX idx_book_purchases_stripe ON book_purchases(stripe_payment_id);

-- Function to get next copy number
CREATE OR REPLACE FUNCTION get_next_copy_number()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(copy_number), 0) + 1
  INTO next_num
  FROM book_purchases
  WHERE edition = 'founding';
  
  IF next_num > 100 THEN
    RAISE EXCEPTION 'Founding edition sold out (100 copies)';
  END IF;
  
  RETURN next_num;
END;
$$;

-- Function to get remaining copies
CREATE OR REPLACE FUNCTION get_remaining_copies()
RETURNS INTEGER
LANGUAGE sql
AS $$
  SELECT 100 - COUNT(*)::INTEGER
  FROM book_purchases
  WHERE edition = 'founding';
$$;


