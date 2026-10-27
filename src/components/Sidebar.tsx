"use client"
import Link from "next/link";
import styles from "./sidebar.module.css";
import { useUStore } from '@/store/userStore';

interface Props {
    isLogged: boolean;
    username: string | null;
}

export default function Sidebar({isLogged, username}: Props) {
    const lang = useUStore(s => s.language);
    const setLang = useUStore(s => s.setLanguage);

    return(
        <div className={styles.sidebar}>
            <h1>Hana gate</h1>
            <p className={styles.undertext}>{lang === 'eng' ? 'visual novels' : 'ビジュアルノベル' }</p>
            <div className={styles.lang}>
                <button onClick={() => setLang('eng')}>English</button>
                <button onClick={() => setLang('jp')}>日本語</button>
            </div>
            <nav>
                <Link href="/">{lang === 'eng' ? 'Visual Novels' : 'ビジュアルノベル' }</Link>
                <Link href='/characters'>{lang === 'eng' ? 'Characters' : 'キャラクタ'}</Link>
                <Link href='/users'>{lang === 'eng' ? 'Users' : 'ユーザー'}</Link>
                {isLogged ? 
                    <div className={styles.extraLinks}>
                        {username && 
                            <Link href={`/users/${username}`}>{lang === 'eng' ? 'Profile' : 'プロフィール'}</Link>
                        }
                        <Link href='/settings'>{lang === 'eng' ? 'Settings': '設定'}</Link>
                    </div> :
                    <div className={styles.extraLinks}>
                        <Link href='/login'>{lang === 'eng' ? 'Login': 'ログイン'}</Link>
                        <Link href='/register'>{lang === 'eng' ? 'Register': '登録'}</Link>
                    </div>
                }
            </nav>
        </div>
    )
}