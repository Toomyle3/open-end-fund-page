import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { notFound } from 'next/navigation'; // Import the notFound function

const intlMiddleware = createMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "en",
});

export default clerkMiddleware((auth, req) => {
  const isPublicRoute = req.nextUrl.pathname.startsWith("/sign-in");
  if (!isPublicRoute) {
    auth().protect();
    return intlMiddleware(req);
  }
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
