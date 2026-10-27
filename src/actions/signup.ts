'use server';

import {z} from "zod"
import { auth } from '@/lib/server';
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";

const SignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    name: z.string().min(1).max(45)
});

export async function signUpWithEmail(
    _prevState: { error: string } | null | undefined,
    formData: FormData
): Promise<{ error: string } | null | undefined> {

    const parsed = SignUpSchema.safeParse({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        username: formData.get("username") as string,
        name: formData.get("name") as string,
    });

    if (!parsed.success) {
        return { error: "Invalid data / 無効なデータです" }
    }

    const { email, password, username, name } = parsed.data;

    try {
        const existUsername = await sql`SELECT 1 FROM public.profiles WHERE username = ${username} LIMIT 1`;

        if (existUsername.length > 0) {
            return { error: "Username already exists / このユーザー名は既に使用されています" }
        }

        const {data, error} = await auth.signUp.email({
            email: email,
            name: name,
            password: password,
        });

        if (error || !data.user) {
            return { error: 'Failed to create account / アカウントの作成に失敗しました' };
        }

        try {
            await sql`INSERT INTO public.profiles ("userId", username, name) VALUES (${data.user.id}::uuid, ${username}, ${name})`;
        } catch (profileError) {
            try {
                await auth.deleteUser();
            } catch(rollbackError) {
                return { error: 'Failed to create account / アカウントの作成に失敗しました' };
            }
        }
        
    } catch (error) {
        return { error: 'Failed to create account / アカウントの作成に失敗しました' };
    }
    
    redirect("/");
}