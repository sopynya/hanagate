"use client";
import { useState } from 'react'
import styles from './auth.module.css'
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    return(
        <div className={styles.page} >
            <div className={styles.auth}>
                <h1>Login <span>ログイン</span></h1>
                <p className={styles.subtitle}>
                    Please enter your email and password.
                    <span>メールアドレスとパスワードを入力してください。</span>
                </p>
                
                <form className={styles.form}>
                    <label>
                        <p>
                            Email<br/>
                            <span>メールアドレス</span>
                        </p>
                        
                        <input type="email" />
                    </label>
                    <label>
                        <p>
                            Password<br/>
                            <span>パスワード</span>
                        </p>
                        
                        <input type="password" />
                    </label>
                    <button type='submit' disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
                </form>
            </div>
        </div>
    )
}