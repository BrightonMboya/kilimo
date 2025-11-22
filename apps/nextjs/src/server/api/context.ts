import { auth } from "~/utils/lib/auth/auth";
import { db } from "@kilimo/db";
import { createClient } from "~/utils/supabase/server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const supabase = createClient();
  const session = await auth();

  return {
    db,
    session,
    supabase,
    headers: opts.headers,
  };
};
