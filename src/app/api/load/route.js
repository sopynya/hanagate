import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/getUser";

export async function GET(req) {
    const userId = await getUserIdFromToken();
    const [profile] = await sql`SELECT username, name, avatar FROM users WHERE id = ${userId}`;
    const [config] = await sql`SELECT color, ofage, language, page, "order" FROM config WHERE user_id = ${userId}`
    return NextResponse.json({
        profile,
        config
    })
}