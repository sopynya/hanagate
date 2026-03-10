"use client";
import styles from './vnpage.module.css';
import novels from '@/data/vn.json'
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import BackButton from './BackButton';
import Reviews from './Reviews';
import VnCharacters from './VnCharacters';
export default function VNPage({user, id}) {
    const [reveal, setReveal] = useState(false);
    const [rating, setRating] = useState(0);
    const [status, setStatus] = useState({
        read:false,
        saved:false,
        favorite:false
    });
    const [loading,setLoading] = useState({
        read:false,
        saved:false,
        favorite:false
    });

    async function toggle(type){

        setLoading(prev => ({...prev,[type]:true}));

        const res = await fetch(`/api/vn/${type}/${id}`,{
            method:"POST"
        });

        const data = await res.json();

        setStatus(prev => ({...prev,...data}));

        setLoading(prev => ({...prev,[type]:false}));
    }

    const ofAge = useUserStore(s => s.ofage);
    const lang = useUserStore(s => s.language);
    const vn = novels.find(v => v.id === Number(id));
    
    if (!vn) {
        return <p>Visual novel not found</p>;
    }

    useEffect(() => {

        fetch(`/api/vn/status/${id}`)
        .then(res => res.json())
        .then(data => setStatus(data));

    }, [id]);

    useEffect(() => {

        async function loadRating(){

            const res = await fetch(`/api/vn-rating/${id}`);
            const data = await res.json();

            setRating(data || 0);
        }

        loadRating();

    }, [id]);

    const blocked = !ofAge && !vn.safe && !reveal;
    const title = lang === "eng" ? vn.enname : vn.jpname;
    const categories = lang === "eng" ? vn.categories : vn.categoriesjp;
    const description = lang === "eng" ? vn.description : vn.descriptionjp;
    return(
        <div className={styles.bg}>
            <div className={styles.page}>
                <BackButton />
                <div className={styles.info}>
                    <div className={styles.cover}>
                        {blocked ? (
                            <div className={styles.nsfw}>
                                <p>{lang === "eng" ? "Sexual content" : "性的コンテンツ"}</p>
                                <button onClick={() => setReveal(true)}>{lang === "eng" ? "View anyway" : "表示する"}</button>
                            </div>
                        ) : (
                            <img src={vn.cover} alt={title}/>
                        )}
                    </div>

                    <div>
                        <h1>{vn.enname}</h1>
                        <h2>{vn.jpname}</h2>
                        <p className={styles.average}>{vn.playtime}h - ★ { Number(rating.average).toFixed(1)} / 10</p>
                        <p className={styles.dev}>{lang === "eng" ? "Developer" : "開発者"}: {vn.developer}</p>
                        <div className={styles.categories}>
                            {categories.map((cat) => (
                                <p key={cat}>{cat}</p>
                            ))}
                        </div>
                        
                        <hr className={styles.hr} />
                        <p className={styles.description}>{description}</p>

                        {user && (
                            <div className={styles.actions}>
                                <button onClick={()=>toggle("read")} disabled={loading.read}>
                                    {loading.read ? (lang==="eng"?"Loading...":"読み込み中...") : (lang === "eng" ? (status.read ? "Read ✓" : "Read") : (status.read ? "プレイ済み ✓" : "プレイ済み")) }
                                </button >
                                <button onClick={()=>toggle("saved")} disabled={loading.saved}>
                                    {loading.saved ? (lang==="eng"?"Loading...":"読み込み中...") : (lang === "eng" ? (status.saved ? "Saved ✓" : "Save") : (status.saved ? "保存済み ✓" : "保存"))}
                                </button>
                                <button onClick={()=>toggle("favorite")} disabled={loading.favorite}>
                                    {loading.favorite ? (lang==="eng"?"Loading...":"読み込み中...") : (lang === "eng" ? (status.favorite ? "Favorited ♥" : "Favorite ♡"): (status.favorite ? "お気に入り ♥" : "お気に入り ♡"))}
                                </button>
                            </div>
                        )}

                        <hr className={styles.hr} style={{margin: "10px 0"}} />
                        <VnCharacters vnId={id} lang={lang} />
                    
                    </div>
                    
                </div>
                        <p className={styles.warning}>
                            {lang === "eng" 
                            ? "Character images belong to their respective creators and studios. They are used for identification and fan purposes only. If you are the copyright holder and want content removed, please contact us." 
                            : "掲載されているキャラクター画像の著作権は、各制作会社および権利者に帰属します。問題がある場合や削除をご希望の際は、お手数ですがご連絡ください。"}
                        </p>
                
            </div>

            <Reviews vnId={vn.id} user={user} lang={lang} />
        </div>
    )
}