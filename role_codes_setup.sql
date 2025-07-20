-- Create role_codes table
CREATE TABLE IF NOT EXISTS role_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('lecturer', 'admin')),
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_role_codes_code ON role_codes(code);
CREATE INDEX IF NOT EXISTS idx_role_codes_unused ON role_codes(code) WHERE used = FALSE;

-- Insert some sample role codes
INSERT INTO role_codes (code, role) VALUES
  ('LECTURER2024', 'lecturer'),
  ('ADMIN2024', 'admin'),
  ('TEACHER001', 'lecturer'),
  ('ADMIN001', 'admin'),
  ('FACULTY2024', 'lecturer')
ON CONFLICT (code) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE role_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow authenticated users to read unused codes (for validation)
CREATE POLICY "Allow read unused role codes" ON role_codes
  FOR SELECT USING (used = FALSE);

-- Allow authenticated users to update codes they use
CREATE POLICY "Allow update used role codes" ON role_codes
  FOR UPDATE USING (auth.uid() = used_by);

-- Allow admins to manage all role codes
CREATE POLICY "Allow admin manage role codes" ON role_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  ); 