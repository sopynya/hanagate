import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/getUser";

export async function POST(req,{params}){

    const userId = await getUserIdFromToken();
    const p = await params;
    const vnId = Number(p.id);

    if(!userId){
        return NextResponse.json({error:"Unauthorized"}, {status:401});
    }

    const exist = await sql`
        SELECT 1 FROM favorites 
        WHERE user_id=${userId} AND vn_id=${vnId}
    `;

    if(exist.length){

        await sql`
        DELETE FROM favorites 
        WHERE user_id=${userId} AND vn_id=${vnId}
        `;

        return NextResponse.json({favorite:false});
    }

    await sql`
        INSERT INTO favorites (user_id,vn_id)
        VALUES (${userId},${vnId})
    `;

    return NextResponse.json({favorite:true});
}