"use client";
import Link from 'next/link';
import styles from './sidebar.module.css';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter } from "next/navigation";
import novels from '@/data/vn.json'
export default function Sidebar({user}) {
    const hydrate = useUserStore(s => s.hydrate);
    const lang = useUserStore(s => s.language);
    const username = useUserStore(s => s.username);
    const setLang = useUserStore(s => s.setLanguage);
    const router = useRouter();

    function goRandom() {
        const random = novels[Math.floor(Math.random() * novels.length)];
        router.push(`/vn/${random.id}`);
    }

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
                    <button onClick={goRandom}>{lang === 'eng' ? 'Random': 'ランダム'}</button>
                    {user ? (
                        <div className={styles.nav}>
                            <Link href='/saved'>{lang === 'eng' ? 'My List': 'マイリスト'}</Link>
                            {username && <Link href={`/users/${username}`}>{lang === 'eng' ? 'Profile': 'プロフィール'}</Link>}
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