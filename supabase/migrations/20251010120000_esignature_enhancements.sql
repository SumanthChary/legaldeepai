-- Extend signature tables for enhanced e-sign workflow
ALTER TABLE public.signature_requests
  ADD COLUMN IF NOT EXISTS completed_document_path TEXT,
  ADD COLUMN IF NOT EXISTS audit_pdf_path TEXT,
  ADD COLUMN IF NOT EXISTS document_hash TEXT,
  ADD COLUMN IF NOT EXISTS last_notification_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.signing_sessions
  ADD COLUMN IF NOT EXISTS otp_code_hash TEXT,
  ADD COLUMN IF NOT EXISTS otp_code_expires_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS otp_attempts SMALLINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS otp_verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS signed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS last_email_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS audit_trail JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Audit log table capturing immutable signature events
CREATE TABLE IF NOT EXISTS public.signature_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.signature_requests(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.signing_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_type TEXT,
  actor_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.signature_events ENABLE ROW LEVEL SECURITY;

-- Request owner can view all events for their requests
DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'signature_events'
      AND policyname = 'Request owner can view signature events'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Request owner can view signature events"
      ON public.signature_events
      FOR SELECT
      USING (
        request_id IN (
          SELECT id FROM public.signature_requests WHERE user_id = auth.uid()
        )
      )
    $$;
  END IF;
END
$do$;

-- Allow service role insert/update bypassing RLS (handled via `security definer` edge functions)
DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'signature_events'
      AND policyname = 'Service insert signature events'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Service insert signature events"
      ON public.signature_events
      FOR INSERT
      WITH CHECK (true)
    $$;
  END IF;
END
$do$;

-- Grant update on signing_sessions audit trail to service role via RLS policy
DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'signing_sessions'
      AND policyname = 'Owner can view signing sessions'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Owner can view signing sessions"
      ON public.signing_sessions
      FOR SELECT
      USING (
        field_id IN (
          SELECT id FROM public.signature_fields WHERE request_id IN (
            SELECT id FROM public.signature_requests WHERE user_id = auth.uid()
          )
        )
      )
    $$;
  END IF;
END
$do$;
