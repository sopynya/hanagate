import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {

    const { id } = await params;

    const result = await sql`
        SELECT 
            AVG(vote)::numeric(10,2) as average,
            COUNT(*) as total
        FROM stars
        WHERE vn_id = ${id}
    `;

    return NextResponse.json(result[0]);
}