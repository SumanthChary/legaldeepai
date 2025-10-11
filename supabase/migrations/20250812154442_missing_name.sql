-- Fix critical security vulnerability: Remove public read access to profiles table
-- This prevents unauthorized access to user email addresses and personal data

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- Create a secure policy that only allows users to see their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- For any functionality that needs to display usernames publicly (like author info),
-- we can create a specific view or function that only exposes non-sensitive data
CREATE OR REPLACE FUNCTION public.get_public_profile(user_id uuid)
RETURNS TABLE(username text)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT p.username
  FROM public.profiles p
  WHERE p.id = user_id;
$$;