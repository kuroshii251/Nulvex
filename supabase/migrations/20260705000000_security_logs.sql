CREATE TABLE IF NOT EXISTS security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    email TEXT,
    ip_address TEXT,
    user_agent TEXT,
    detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from the service role (or anyone, depending on how logging is done)
-- Normally, if we use service role to insert, RLS is bypassed. But we can add a policy just in case.
CREATE POLICY "Enable insert for authenticated users or service role" ON security_logs
    FOR INSERT
    WITH CHECK (true);

-- Only allow admin (or service role) to view
CREATE POLICY "Enable read for admin" ON security_logs
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE email = current_setting('app.settings.admin_email', true)
    ));
