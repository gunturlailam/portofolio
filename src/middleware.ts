import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginPath = "/admin/login";
  const dashboardPath = "/admin/dashboard";

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
  let isAuthed = false;

  if (envReady) {
    const supabase = createServerClient(url, key, {
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
    isAuthed = !!data.user;
  }

  const isLogin = pathname.startsWith(loginPath);

  // sudah login tapi buka /admin/login → lempar ke dashboard
  if (isLogin && isAuthed) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }
  // belum login tapi buka /admin/* (selain login) → lempar ke login
  if (!isLogin && !isAuthed) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return response;
}

// proteksi hanya untuk rute admin
export const config = { matcher: ["/admin/:path*"] };
