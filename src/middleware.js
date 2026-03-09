import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
export async function middleware(request) {
    const userId = await getUserIdFromToken();

    const pathname = request.nextUrl.pathname;

    const authPages = ["/login", "/register"];
    const protectedPages = ["/profile", "/saved"];

    if (userId && authPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    if (!userId && protectedPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/profile", "/saved"],
};