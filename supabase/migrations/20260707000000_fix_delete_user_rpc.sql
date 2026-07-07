-- Drop and recreate delete_user function to fix schema cache issue
-- The function must be in the public schema with SECURITY DEFINER

DROP FUNCTION IF EXISTS public.delete_user();

CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete the user from auth.users (cascades to related tables)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
