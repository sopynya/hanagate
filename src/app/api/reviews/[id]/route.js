import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req,{ params }) {

    const { id } = await params;

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);

    const vnId = String(id);

    const limit = 10;
    const offset = (page - 1) * limit;

    const reviews = await sql`
        SELECT 
            stars.user_id,
            stars.vote,
            stars.review,
            users.username,
            users.name,
            users.avatar
        FROM stars
        JOIN users ON users.id::text = stars.user_id
        WHERE stars.vn_id = ${vnId}
        ORDER BY stars.updated_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
    `;

    const total = await sql`
        SELECT COUNT(*) 
        FROM stars 
        WHERE vn_id=${vnId}
    `;

    return NextResponse.json({
        reviews,
        total:Number(total[0].count)
    });
}