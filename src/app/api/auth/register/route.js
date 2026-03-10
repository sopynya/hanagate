import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {username, name, email, password} = await req.json();

    if (!username || !name || !email || !password) {
        return NextResponse.json(
            { error: "Invalid data / 無効なデータです" },
            { status: 400 }
        );
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!usernameRegex.test(username)) {
        return NextResponse.json(
            { error: "Invalid username / ユーザー名は英数字とアンダースコアのみ使用できます" },
            { status: 400 }
        );
    }

    const existEmail = await sql`SELECT 1 FROM users WHERE email = ${email}`;
    const existUsername = await sql`SELECT 1 FROM users WHERE username = ${username}`;

    if (existEmail.length > 0) {
        return NextResponse.json(
            { error: "Email already exists / このメールアドレスは既に登録されています" },
            { status: 409 }
        );
    }

    if (existUsername.length > 0) {
        return NextResponse.json(
            { error: "Username already exists / このユーザー名は既に使用されています" },
            { status: 409 }
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await sql`INSERT INTO users (username, name, email, password) VALUES (${username}, ${name}, ${email}, ${hashedPassword}) RETURNING id`;
    
    const userId = user[0].id;

    await sql`INSERT INTO config (user_id) VALUES (${userId})`;

    const token = jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, 
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return res;
}