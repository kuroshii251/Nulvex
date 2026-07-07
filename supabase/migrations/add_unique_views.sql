-- Create a table to track which IPs have viewed which posts
CREATE TABLE IF NOT EXISTS writeup_post_view_logs (
  post_id uuid NOT NULL REFERENCES writeup_posts(id) ON DELETE CASCADE,
  ip_address text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, ip_address)
);

-- Drop the old function first if we need to change its signature
DROP FUNCTION IF EXISTS increment_writeup_views(uuid);

-- Create a new version of the function that accepts the IP address
CREATE OR REPLACE FUNCTION increment_writeup_views(post_id uuid, client_ip text)
RETURNS void AS $$
BEGIN
  -- Attempt to insert a new view log
  INSERT INTO writeup_post_view_logs (post_id, ip_address)
  VALUES (post_id, client_ip)
  ON CONFLICT DO NOTHING;

  -- If the insert was successful (meaning it's a new IP for this post)
  IF FOUND THEN
    UPDATE writeup_posts SET views = views + 1 WHERE id = post_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
