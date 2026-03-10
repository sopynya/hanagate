import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {email, password} = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { error: "Invalid data / 無効なデータです" },
            { status: 400 }
        );
    }

    const user = await sql`SELECT id, password FROM users WHERE email = ${email}`;

    if(user.length === 0) {
        return NextResponse.json(
            { error: "Invalid credentials / メールアドレスまたはパスワードが正しくありません" },
            { status: 401 }
        );
    }

    const valid = await bcrypt.compare(password, user[0].password);

    if (!valid) {
        return NextResponse.json(
            { error: "Invalid credentials / メールアドレスまたはパスワードが正しくありません" },
            { status: 401 }
        );
    }

    const token = jwt.sign(
        {id: user[0].id},
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