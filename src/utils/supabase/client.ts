import { createBrowserClient } from "@supabase/ssr";
import { Database } from "~/server/supabase/supabaseTypes";


export function createClient<Database>() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
