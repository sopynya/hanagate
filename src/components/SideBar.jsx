"use client";
import Link from 'next/link';
import styles from './sidebar.module.css';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
export default function Sidebar({user}) {
    const hydrate = useUserStore(s => s.hydrate);
    const lang = useUserStore(s => s.language);
    const setLang = useUserStore(s => s.setLanguage);

    useEffect(() => {
        async function loadInfo() {
            try {
                const res = await fetch('/api/load');
                if(res.ok) {
                    const data = await res.json();
                    hydrate(data);
                } else {
                    const data = await res.json();
                    console.log(data.error || "Error fetching data");
                }
            } catch(err) {
                console.log(err.message);
            }
        }
        loadInfo();
    }, [])
    return(
        <div className={styles.sidebar}>
            <div>
                <h1>Hana gate</h1>
                <p>{lang === 'eng' ? 'visual novels' : 'ビジュアルノベル' }</p>

                <nav>
                    <Link href='/'>{lang === 'eng' ? 'Visual Novels' : 'ビジュアルノベル' }</Link>
                    <Link href='/characters'>{lang === 'eng' ? 'Characters' : 'キャラクタ'}</Link>
                    <Link href='/users'>{lang === 'eng' ? 'Users' : 'ユーザー'}</Link>
                    <Link href='/random'>{lang === 'eng' ? 'Random': 'ランダム'}</Link>
                    {user ? (
                        <div className={styles.nav}>
                            <Link href='/saved'>{lang === 'eng' ? 'My List': 'マイリスト'}</Link>
                            <Link href='/profile'>{lang === 'eng' ? 'Profile': 'プロフィール'}</Link>
                            <Link href='/configurations'>{lang === 'eng' ? 'Configurations': '設定'}</Link>
                        </div>
                    ) : (
                        <div className={styles.nav}>
                            <Link href='/login'>{lang === 'eng' ? 'Login': 'ログイン'}</Link>
                            <Link href='/register'>{lang === 'eng' ? 'Register': '登録'}</Link>
                        </div>
                    )}
                </nav>
            </div>
            <div>
                <div className={styles.lang}>
                    <button onClick={() => setLang('eng')}>English</button>
                    <button onClick={() => setLang('jp')}>日本語</button>
                </div>
                <img src='/ad7.jpg'/>
            </div>
            
        </div>
    )
}