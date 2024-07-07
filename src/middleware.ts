import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  console.log("Route", req.nextUrl.pathname);
});
