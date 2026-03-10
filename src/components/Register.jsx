"use client";
import { useState } from "react";
import styles from './auth.module.css'
export default function Register() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, name, email, password })
            });
            if (res.ok) {
                setLoading(false);
                window.location.href = "/profile"
            } else {
                const data = await res.json();
                setError(data.error);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            setError('Something went wrong / エラーが発生しました');
        }
    }
    return(
        <div className={styles.page}>
            <div className={styles.auth}>
                <h1>Create your account <span>アカウントを作成</span></h1>
                <p className={styles.subtitle}>
                    Please enter your info
                    <span>情報を入力してください</span>
                </p>

                <form className={styles.form} onSubmit={handleRegister}>
                    <label>
                        <p>
                            Username<br/>
                            <span>ユーザー名</span>
                        </p>
                        <input type='text' value={username} onChange={e => setUsername(e.target.value)} required pattern="^[a-zA-Z0-9_]+$" title="Only letters, numbers and underscore allowed / 英数字とアンダースコアのみ使用できます"/>
                        
                    </label>
                    <label>
                        <p>
                            Name<br/>
                            <span>名前</span>
                        </p>
                        <input type='text' value={name} onChange={e => setName(e.target.value)} required/>
                    </label>
                    <label>
                        <p>
                            Email<br/>
                            <span>メールアドレス</span>
                        </p>
                        <input type='email' value={email} onChange={e => setEmail(e.target.value)} required/>
                    </label>
                    <label>
                        <p>
                            Password<br/>
                            <span>パスワード</span>
                        </p>
                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} required/>
                    </label>
                    <button type='submit' disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>

                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>  
        </div>
    )
}