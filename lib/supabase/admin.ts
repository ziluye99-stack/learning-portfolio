import { createClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey, supabaseUrl } from "@/lib/supabase/config";
import { createTimeoutFetch } from "@/lib/supabase/timeout-fetch";

export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    global: {
      fetch: createTimeoutFetch()
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
