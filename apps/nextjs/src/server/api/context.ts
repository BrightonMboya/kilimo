import { auth } from "~/utils/lib/auth/auth";
import { db } from "@kilimo/db";
import { createClient } from "~/utils/supabase/server";
import { verifyToken } from "@clerk/backend";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const supabase = createClient();
  
  // Check for Clerk authentication (from mobile app)
  const authHeader = opts.headers.get("authorization") || opts.headers.get("Authorization");
  
  let session = null;
  
  if (authHeader) {
    // Clerk authentication from mobile app
    try {
      // Remove "Bearer " prefix if present, otherwise use as-is
      const token = authHeader.startsWith("Bearer ") 
        ? authHeader.replace("Bearer ", "")
        : authHeader;
      
      // Verify the Clerk JWT token
      const clerkSecretKey = process.env.CLERK_SECRET_KEY;
      
      if (!clerkSecretKey) {
        throw new Error("CLERK_SECRET_KEY is not configured");
      }
      
      const payload = await verifyToken(token, {
        secretKey: clerkSecretKey,
      });
      
      if (payload && payload.sub) {
        // Create a session object compatible with NextAuth format
        session = {
          user: {
            id: payload.sub,
            name: null,
            email: null,
          },
          expires: new Date((payload.exp || 0) * 1000).toISOString(),
        };
      }
    } catch (error) {
      // Clerk token verification failed, fall through to try NextAuth
    }
  }
  
  // If no Clerk session, try NextAuth (for web app)
  if (!session) {
    session = await auth();
  }

  return {
    db,
    session,
    supabase,
    headers: opts.headers,
  };
};
