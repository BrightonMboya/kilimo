import { createClient } from "@supabase/supabase-js";

import { type Database } from "./supabaseTypes";

import { env } from "~/env";

export const getServiceSupabase = () =>
  createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

export const clientSupabase = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const supabase = () =>
  typeof window === "undefined" ? getServiceSupabase() : clientSupabase;

export const getUserAsAdmin = async (token: string) => {
  const { data, error } = await getServiceSupabase().auth.getUser(token);
  //  console.log(data, ">?>><><><A>>ASA<<AS<ASA")

  if (error) {
    console.error(error.message);
    throw error;
  }

  return data;
};
