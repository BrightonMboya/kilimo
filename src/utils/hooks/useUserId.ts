import "server-only";
// "use server";
import { createClient } from "../supabase/server";

export async function useUserId() {
  const supabase = createClient();
  const user = await (await supabase).auth.getUser();
  const organizations_id = user?.data?.user?.id as string;
  return organizations_id;
}
