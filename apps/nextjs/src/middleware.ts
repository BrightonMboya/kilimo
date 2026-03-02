import createIntlMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import authConfig from "./utils/lib/auth/auth.config";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);
const { auth } = NextAuth(authConfig);

// App routes that should NOT go through i18n
const appRoutes = /^\/(dashboard|welcome|login|register|invites|legal)(\/|$)/;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // App routes — only auth, no i18n
  if (appRoutes.test(pathname)) {
    return (auth as any)(request);
  }

  // Marketing routes — i18n handles locale detection/redirect
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next|monitoring|api|trpc).*)"],
};
