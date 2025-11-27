import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";


const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// async function uploadProfilePic(file) {
// const {data, error} = await supabase.storage
// .from("profile_pic")
// .upload(file)
// }