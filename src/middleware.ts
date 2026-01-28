import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    try {
        // 1. Check for required environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Middleware Error: Missing Supabase environment variables.');
            return NextResponse.next();
        }

        let supabaseResponse = NextResponse.next({
            request,
        })

        // 2. Initialize Supabase client
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // 3. Get session/user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // Explicitly handle auth errors without crashing
        if (authError) {
            console.warn('Middleware Auth Check Warning:', authError.message);
            // Continue but treat as unauthenticated
        }

        const { pathname } = request.nextUrl

        // 4. Protection logic
        const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/auth')
        const isProtectedPage = pathname === '/' || pathname.startsWith('/upload') || pathname.startsWith('/roi')

        if (!user && isProtectedPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        if (user && isAuthPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }

        return supabaseResponse

    } catch (error) {
        // Top-level catch to prevent 500 middleware crashes
        console.error('CRITICAL MIDDLEWARE ERROR:', error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
