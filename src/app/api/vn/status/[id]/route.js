import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/getUser";

export async function GET(req, { params }) {

    const userId = await getUserIdFromToken();

    if (!userId) {
        return NextResponse.json({
            read: false,
            saved: false,
            favorite: false
        });
    }
    const p = await params;
    const vnId = Number(p.id);

    const [read] = await sql`
        SELECT 1 FROM read 
        WHERE user_id = ${userId} AND vn_id = ${vnId}
        LIMIT 1
    `;

    const [saved] = await sql`
        SELECT 1 FROM saved 
        WHERE user_id = ${userId} AND vn_id = ${vnId}
        LIMIT 1
    `;

    const [favorite] = await sql`
        SELECT 1 FROM favorites 
        WHERE user_id = ${userId} AND vn_id = ${vnId}
        LIMIT 1
    `;

    return NextResponse.json({
        read: !!read,
        saved: !!saved,
        favorite: !!favorite
    });
}