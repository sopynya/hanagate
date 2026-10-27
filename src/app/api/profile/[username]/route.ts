import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type RouteParams = {
  params: Promise<{
    username: string;
  }>;
};

export async function GET({params}: RouteParams) {
    const {username} = await params;

    try {
      const profileRes = await sql`SELECT * FROM profiles WHERE username = ${username} LIMIT 1`;
      const profile = profileRes[0];
      if (!profile) {
        NextResponse.json({error: "User does not exist / "});
      }

      const read = await sql`SELECT * FROM public.'read' WHERE "userId" = ${profile.userId}::uuid`;
      const reading = await sql`SELECT * FROM reading WHERE userId = ${profile.userId}`;
      const plan = await sql`SELECT * FROM plan WHERE userId = ${profile.userId}`;
      const dropped = await sql`SELECT * FROM dropped WHERE userId = ${profile.userId}`;
      const reviews = await sql`SELECT * FROM reviews WHERE userId = ${profile.userId}`;

      const vnIds = [
        ...read.map((r: any) => r.vnId),
        ...reading.map((r: any) => r.vnId),
        ...plan.map((r: any) => r.vnId),
        ...dropped.map((r: any) => r.vnId),
        ...reviews.map((r: any) => r.vnId),
      ].filter(Boolean);

      const uniqueVnIds = [...new Set(vnIds)];

      const vndbRes = uniqueVnIds.length > 0
        ? await fetch("https://api.vndb.org/kana/vn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              filters: ["id", "in", uniqueVnIds],
              fields: "id, title, alttitle, image.url, image.sexual",
          }),
        })
      : null;

      const vndbData = vndbRes && vndbRes.ok
        ? (await vndbRes.json()).results
      : [];

      const vnMap = new Map(vndbData.map((vn: any) => [vn.id, vn]));

      const lists = { read, reading, plan, dropped, reviews };
      const enriched: Record<string, any[]> = {};

      for (const [key, rows] of Object.entries(lists)) {
        enriched[key] = rows.map((r: any) => ({ ...r, vn: vnMap.get(r.vnId) ?? null }));
      }

      const readCount = await sql`COUNT(*) FROM 'read' WHERE userId = ${profile.userId}`;
      const reviewsCount = await sql`COUNT(*) FROM reviews WHERE userId = ${profile.userId}`;
      const readingCount = await sql`COUNT(*) FROM reading WHERE userId = ${profile.userId}`;
      const planCount = await sql`COUNT(*) FROM plan WHERE userId = ${profile.userId}`;
      const droppedCount = await sql`COUNT(*) FROM dropped WHERE userId = ${profile.userId}`;

      NextResponse.json({profile, })
    } catch(error) {

    }

}