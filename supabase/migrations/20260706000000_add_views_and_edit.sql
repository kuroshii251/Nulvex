-- Add views column to writeup_posts
ALTER TABLE writeup_posts ADD COLUMN IF NOT EXISTS views int NOT NULL DEFAULT 0;

-- Function to securely increment views
CREATE OR REPLACE FUNCTION increment_writeup_views(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE writeup_posts SET views = views + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update policy for writeup_comments (allow users to edit their own comments)
CREATE POLICY "comments_update_own"
  ON writeup_comments FOR UPDATE
  USING (auth.uid() = author_id);
