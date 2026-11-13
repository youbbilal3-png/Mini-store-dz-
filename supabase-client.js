import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/+esm";
export const supabase = createClient("https://dmnbplhwckccutwdizzn.supabase.co", "sb_publishable_EuPlcSRzAWgd1_Rml1W7YQ_AbUy7za3", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
