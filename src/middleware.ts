import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'id',
  localePrefix: 'as-needed'
});

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const loginPath = "/admin/login";
  const dashboardPath = "/admin/dashboard";

  // Skip i18n for admin and api routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const envReady =
      !!url &&
      !!key &&
      url.startsWith("http") &&
      key.length > 10 &&
      !key.includes("your_");

    let response = NextResponse.next({ request });
    let user: { email?: string } | null = null;

    if (envReady) {
      const supabase = createServerClient(url!, key!, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      });
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    const email = (user?.email ?? "").toLowerCase();
    const isAdmin =
      !!user && (ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(email));

    const isLogin = pathname.startsWith(loginPath);
    const alreadyDenied = searchParams.get("denied") === "1";

    if (isLogin) {
      if (isAdmin && !alreadyDenied)
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      return response;
    }

    if (!user) return NextResponse.redirect(new URL(loginPath, request.url));
    if (!isAdmin)
      return NextResponse.redirect(new URL(`${loginPath}?denied=1`, request.url));
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
