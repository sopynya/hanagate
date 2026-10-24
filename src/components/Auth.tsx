"use client";
import { useActionState } from "react";
import { signUpWithEmail } from "@/actions/signup";
import { signInWithEmail } from "@/actions/signin";
import styles from './auth.module.css';

interface Props {
    sign: string
}
export default function Auth({sign}: Props) {
    const way = sign === "register" ? signUpWithEmail : signInWithEmail;
    const [state, formAction, isPending] = useActionState(way, null);

    return (
        <div className={styles.page}>
            <form action={formAction}>
                <h1>
                    {sign === "register" ? "Create your account" : "Login"}
                </h1>
                <p className={styles.titlejp}>
                    {sign === "register" ? "アカウントを作成" : "ログイン"}
                </p>

                <p className={styles.sub}>
                    {sign === "register" ? "Please enter your info." : "Please enter your email and password."}
                    
                </p>
                <p className={styles.subjp}>
                    {sign === "register" ? "情報を入力してください。" : "メールアドレスとパスワードを入力してください。"}
                </p>

                {sign === "register" && 
                    <div className={styles.inputBox}>
                        <label>
                            <p>Username</p>
                            <p className={styles.labeljp}>ユーザー名</p>
                        </label>
                        <input name="username" type="text" pattern="^[a-zA-Z0-9_]+$" min={3} max={20}
                            title="Only letters, numbers and underscore allowed / 英数字とアンダースコアのみ使用できます" 
                            autoComplete="username" required/>
                    </div>
                }
                {sign === "register" && 
                    <div className={styles.inputBox}>
                        <label>
                            <p>Name</p>
                            <p className={styles.labeljp}>名前</p>
                        </label>
                        <input name="name" type="text" min={1} max={45}
                        required/>
                    </div>
                }
                <div className={styles.inputBox}>
                    <label>
                        <p>Email</p>
                        <p className={styles.labeljp}>メールアドレス</p>
                    </label>
                    <input name="email" type="email" required/>
                </div>
                <div className={styles.inputBox}>
                    <label>
                        <p>Password</p>
                        <p className={styles.labeljp}>パスワード</p>
                    </label>
                    <input name="password" type="password" min={8} required/>
                </div>


                <button type='submit' disabled={isPending}>
                    {sign === "register" ? isPending ? 'Creating Account...': 'Create Account' : isPending ? 'Logging in...' : 'Login'}
                </button>

                {state?.error && <p className={styles.error}>{state.error}</p>}
            </form>
        </div>
    );
}