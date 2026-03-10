import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
export async function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const userId = await getUserIdFromToken(token);

    const pathname = request.nextUrl.pathname;

    const authPages = ["/login", "/register"];
    const protectedPages = ["/configurations", "/saved"];

    if (userId && authPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!userId && protectedPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/configurations", "/saved"],
};