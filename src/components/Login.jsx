"use client";
import { useState } from 'react'
import styles from './auth.module.css'
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch('/api/auth/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                setLoading(false);
                window.location.href = "/profile"
            } else {
                const data = await res.json();
                setError(data.error);
                setLoading(false);
            }
        } catch(err) {
            setLoading(false);
            setError('Something went wrong / エラーが発生しました');
        }
    }
    return(
        <div className={styles.page} >
            <div className={styles.auth}>
                <h1>Login <span>ログイン</span></h1>
                <p className={styles.subtitle}>
                    Please enter your email and password.
                    <span>メールアドレスとパスワードを入力してください。</span>
                </p>
                
                <form className={styles.form} onSubmit={handleLogin}>
                    <label>
                        <p>
                            Email<br/>
                            <span>メールアドレス</span>
                        </p>
                        
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    </label>
                    <label>
                        <p>
                            Password<br/>
                            <span>パスワード</span>
                        </p>
                        
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </label>
                    <button type='submit' disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    )
}