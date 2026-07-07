CREATE TABLE IF NOT EXISTS writeup_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES writeup_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE writeup_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "likes_select_all"
  ON writeup_likes FOR SELECT
  USING (true);

CREATE POLICY "likes_insert_own"
  ON writeup_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_delete_own"
  ON writeup_likes FOR DELETE
  USING (auth.uid() = user_id);
