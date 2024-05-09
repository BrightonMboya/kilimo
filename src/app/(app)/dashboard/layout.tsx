import "~/styles/globals.css";

import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";
import Layout from "~/components/Layout/Layout";



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log(user, ">>>>>>>");
  if (!user) {
    return redirect("/auth/sign-in");
  }
  return (
    <html lang="en">
      <body className="">
        <Layout>
          <main className="min-h-screen bg-[#F5F6FA]/40 ">{children}</main>
        </Layout>
      </body>
    </html>
  );
}
