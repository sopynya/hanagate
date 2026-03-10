import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req){

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const search = searchParams.get("search") || "";

    const limit = 20;
    const offset = (page-1)*limit;

    const users = await sql`
        SELECT 
            users.id,
            users.username,
            users.name,
            users.avatar,
            users.description,
            config.color
        FROM users
        LEFT JOIN config ON config.user_id = users.id::text
        WHERE
            users.username ILIKE ${"%" + search + "%"}
            OR users.name ILIKE ${"%" + search + "%"}
        ORDER BY users.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
    `;

    const total = await sql`
        SELECT COUNT(*)
        FROM users
        WHERE
            username ILIKE ${"%" + search + "%"}
            OR name ILIKE ${"%" + search + "%"}
    `;

    return NextResponse.json({
        users,
        total:Number(total[0].count)
    });
}