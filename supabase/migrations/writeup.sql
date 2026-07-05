CREATE TABLE IF NOT EXISTS writeup_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  content         text NOT NULL DEFAULT '',
  cover_image     text,
  tags            text[] DEFAULT '{}',
  author_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_username text NOT NULL,
  read_time       int  NOT NULL DEFAULT 1,
  published       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER writeup_posts_updated_at
  BEFORE UPDATE ON writeup_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE IF NOT EXISTS writeup_comments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id         uuid NOT NULL REFERENCES writeup_posts(id) ON DELETE CASCADE,
  author_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_username text NOT NULL,
  body            text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE writeup_posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE writeup_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select_published"
  ON writeup_posts FOR SELECT
  USING (published = true);

CREATE POLICY "posts_insert_own"
  ON writeup_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts_update_own"
  ON writeup_posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "posts_delete_own"
  ON writeup_posts FOR DELETE
  USING (auth.uid() = author_id);

CREATE POLICY "comments_select_all"
  ON writeup_comments FOR SELECT
  USING (true);

CREATE POLICY "comments_insert_own"
  ON writeup_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "comments_delete_own"
  ON writeup_comments FOR DELETE
  USING (auth.uid() = author_id);

CREATE INDEX IF NOT EXISTS idx_writeup_posts_author    ON writeup_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_writeup_posts_created   ON writeup_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_writeup_comments_post   ON writeup_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_writeup_comments_author ON writeup_comments (author_id);
