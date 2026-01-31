-- Add allowed_plans column to meetings table
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS allowed_plans text[] DEFAULT '{}';

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_meetings_allowed_plans ON meetings USING GIN (allowed_plans);

-- Optional: Update existing meetings to be accessible by all plans if needed, 
-- or leave empty for "full restricted" (the current logic will filter them out)
-- UPDATE meetings SET allowed_plans = ARRAY['Personal Training', 'Individual Group', 'Corporate Group', 'Functional Core'] WHERE allowed_plans = '{}';
