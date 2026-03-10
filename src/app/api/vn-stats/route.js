import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

  const reads = await sql`
    SELECT vn_id, COUNT(*) as total
    FROM read
    GROUP BY vn_id
  `;

  const stars = await sql`
    SELECT 
      vn_id,
      AVG(vote) as average,
      COUNT(*) as total
    FROM stars
    GROUP BY vn_id
    ORDER BY average DESC
  `;

  return NextResponse.json({
    reads,
    stars
  });

}