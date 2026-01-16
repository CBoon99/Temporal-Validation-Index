-- Preview rate limits (IP-based for unauthenticated users)
CREATE TABLE IF NOT EXISTS preview_limits (
  ip TEXT NOT NULL,
  date DATE NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (ip, date)
);

CREATE INDEX idx_preview_limits_date ON preview_limits(date);

-- Add daily_runs counter to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_runs INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_run_date DATE;

-- Function to reset daily runs (call via cron)
CREATE OR REPLACE FUNCTION reset_daily_runs()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE profiles 
  SET daily_runs = 0 
  WHERE last_run_date < CURRENT_DATE;
  
  DELETE FROM preview_limits 
  WHERE date < CURRENT_DATE - INTERVAL '7 days';
END;
$$;

-- Signed URL tokens for PDF downloads
CREATE TABLE IF NOT EXISTS pdf_tokens (
  token TEXT PRIMARY KEY,
  calculation_id UUID REFERENCES calculations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pdf_tokens_expires ON pdf_tokens(expires_at);
CREATE INDEX idx_pdf_tokens_calc ON pdf_tokens(calculation_id);

-- Clean up expired tokens (call via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM pdf_tokens 
  WHERE expires_at < now() OR (used = true AND created_at < now() - INTERVAL '1 hour');
END;
$$;


