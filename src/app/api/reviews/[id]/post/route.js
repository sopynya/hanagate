import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/getUser";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const vnId = String(id);

    const userId = await getUserIdFromToken();
    const { vote, review } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    const exist = await sql`
      SELECT 1 FROM stars
      WHERE user_id = ${userId} AND vn_id = ${vnId}
      LIMIT 1
    `;

    if (exist.length > 0) {
      await sql`
        UPDATE stars
        SET vote = ${vote}, review = ${review}, updated_at = NOW()
        WHERE user_id = ${userId} AND vn_id = ${vnId}
      `;
    } else {
      await sql`
        INSERT INTO stars (user_id, vn_id, vote, review)
        VALUES (${userId}, ${vnId}, ${vote}, ${review})
      `;
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("REVIEW POST ERROR:", err);

    return NextResponse.json(
      { error: "server error" },
      { status: 500 }
    );
  }
}