import NextAuth from "next-auth";
import authConfig from "./utils/lib/auth/auth.config";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/welcome/:path*",
    "/reports/:path*",
  ],
};

const { auth } = NextAuth(authConfig);

export default auth((req) => {});
