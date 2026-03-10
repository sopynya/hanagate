import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {

    const { username } = await params;

    const profileResult = await sql`
        SELECT id, name, avatar, description 
        FROM users 
        WHERE username = ${username}
    `;

    const profile = profileResult[0];

    if(!profile){
        return NextResponse.json({error:"user not found"},{status:404});
    }

    const userId = profile.id;

    const colorResult = await sql`
        SELECT color 
        FROM config 
        WHERE user_id = ${userId}
    `;

    const read = await sql`
        SELECT * 
        FROM read 
        WHERE user_id = ${userId}
    `;
    const saved = await sql`SELECT * FROM saved WHERE user_id = ${userId}`;
    const favorites = await sql`SELECT * FROM favorites WHERE user_id = ${userId}`;
    const reviews = await sql`SELECT * FROM stars WHERE user_id = ${userId}`;

    return NextResponse.json({
        profile,
        color: colorResult[0]?.color || 'pink',
        read,
        saved,
        favorites,
        reviews
    });
}