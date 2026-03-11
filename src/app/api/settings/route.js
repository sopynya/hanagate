import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/getUser";

export async function GET(req) {
  try {
    const userId = await getUserIdFromToken();

    const [profile] = await sql`
      SELECT id, name, username, description, avatar
      FROM users
      WHERE id = ${userId}
    `;

    const [config] = await sql`
      SELECT id, color, ofage as "ofAge", language, page, "order"
      FROM config
      WHERE user_id = ${userId}
    `;

    return NextResponse.json({ profile, config });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const userId = await getUserIdFromToken();
    const body = await req.json();
    const { userData, config } = body;

    const [updatedProfile] = await sql`
      UPDATE users
      SET 
        name = ${userData.name},
        username = ${userData.username},
        description = ${userData.description},
        avatar = ${userData.avatar}
      WHERE id = ${userId}
      RETURNING id, name, username, description
    `;

    const [updatedConfig] = await sql`
      UPDATE config
      SET
        color = ${config.color},
        ofage = ${config.ofAge},
        language = ${config.language},
        page = ${config.page},
        "order" = ${config.order}
      WHERE user_id = ${userId}
      RETURNING id, color, ofage as "ofAge", language, page, "order"
    `;

    return NextResponse.json({
      profile: updatedProfile,
      config: updatedConfig
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}