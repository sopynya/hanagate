'use server';

import { auth } from '@/lib/server';

export async function signInWithEmail(
    _prevState: { error: string } | null | undefined,
    formData: FormData
): Promise<{ error: string } | null | undefined> {
    const { error } = await auth.signIn.email({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    });

    if (error) {
        return { error: "Invalid credentials / メールアドレスまたはパスワードが正しくありません" }
    }

    window.location.href = "/";
}