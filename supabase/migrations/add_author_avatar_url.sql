-- Add author_avatar_url to writeup_posts and writeup_comments
ALTER TABLE writeup_posts
  ADD COLUMN IF NOT EXISTS author_avatar_url text;

ALTER TABLE writeup_comments
  ADD COLUMN IF NOT EXISTS author_avatar_url text;
