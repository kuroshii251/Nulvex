-- Create a function to allow users to delete their own accounts
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run as database creator (superuser)
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete the user from auth.users (this cascades to writeup_posts, writeup_comments, etc.)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
