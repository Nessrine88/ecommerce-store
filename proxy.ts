import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";

const intlMiddleware = createMiddleware({
  locales: ["en", "fr", "ar"],
  defaultLocale: "en",
});

export default auth((req) => {
  const res = intlMiddleware(req);

  if (!req.cookies.get("sessionCartId")) {
    res.cookies.set("sessionCartId", crypto.randomUUID(), { path: "/" });
  }

  return res;
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};