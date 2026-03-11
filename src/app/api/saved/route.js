import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/getUser";

export async function GET(req) {
    const userId = await getUserIdFromToken();
    const saved = await sql`SELECT * FROM saved WHERE user_id = ${userId}`;

    return NextResponse.json(saved);
}