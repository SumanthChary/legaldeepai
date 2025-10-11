// @ts-nocheck
/* eslint-disable */

import { createClient } from "https://esm.sh/v135/@supabase/supabase-js@2.43.4";

const env = (globalThis as any).Deno?.env ?? {
  get: (key: string) => (globalThis as any).process?.env?.[key],
};

const supabaseUrl = env.get("SUPABASE_URL");
const serviceRoleKey = env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!serviceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
