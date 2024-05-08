"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

import { createClient } from "~/utils/supabase/server";

import { cache } from "react";

export const getUser = cache(async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  // if (error || data.user?.id === null) {
  //   return {
  //     user: null,
  //     session: null,
  //   };
  // }

  return data.user;
});

export const signIn = async (formData: FormData) => {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/auth/sign-in?message=Could not authenticate user");
  }

  return redirect("/dashboard/products");
};

export const signOut = async () => {
  "use server";

  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/auth/sign-in");
};

interface AuthProps {
  email: string;
  password: string;
}

export const signUp = async (formData: FormData) => {
  "use server";

  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const organization_name = formData.get("organization_name") as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        organization_name: organization_name,
      },
    },
    // options: {
    //   emailRedirectTo: `${origin}/auth/callback`,
    // },
  });

  // then we add the info on the organization_table
  console.log(data);
  if (data.user !== null && !error) {
    const res = await db.organizations.create({
      data: {
        name: organization_name,
        id: data?.user?.id,
        emailAddress: email,
      },
    });
    console.log(res);
  }

  if (error) {
    console.log(error.message);
    return redirect(`/auth/sign-up?message=${error.message}`);
  }

  return redirect("/dashboard/accounting");
};
