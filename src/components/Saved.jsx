"use client";
import styles from "./saved.module.css"
import { useState,useEffect, use } from "react"
import { useUserStore } from '@/store/userStore';
import novels from '@/data/vn.json';
import Loading from "./Loading";
import Link from "next/link";
export default function Saved() {
    const lang = useUserStore(s => s.language);
    const ofAge = useUserStore(s => s.ofage);
    const [loading,setLoading] = useState(true);
    const [page,setPage] = useState(1);
    const [total,setTotal] = useState(0);
    const [input,setInput] = useState("");
    const [search,setSearch] = useState("");
    const [vns, setVns] = useState([]);
    const [revealed, setRevealed] = useState([]);

    const pages = Math.ceil(total/20);
    async function load() {
        setLoading(true);
        const res = await fetch('/api/saved');
        const data = await res.json();

        const filteredVNs = novels
            .filter((vn) => data.some((saved) => Number(saved.vn_id) === vn.id))
            .map((vn) => {
                const saved = data.find((s) => Number(s.vn_id) === vn.id);
                return { ...vn, saved_at: saved?.saved_at };
            })
            .sort((a, b) => new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime());

        setVns(filteredVNs);
        setTotal(filteredVNs.length);
        setLoading(false);
    }

    useEffect(()=>{
        load()
    },[]);

    function handleSearch(){
        setPage(1);
        setSearch(input);
    }


    function handleKey(e){
        if(e.key === "Enter"){
            handleSearch();
        }
    }

    const filteredVns = vns.filter((vn) => {
        if (!search) return true;
        const term = search.toLowerCase();
        return vn.enname.toLowerCase().includes(term) || vn.jpname.toLowerCase().includes(term);
    });
    const displayedVNs = filteredVns.slice((page - 1) * 20, page * 20);

    if(loading) {
        return <Loading />
    }
    return(
        <div className={styles.bg}>
            <header className={styles.header}>
                <input type='search' placeholder={lang === "eng" ? "Search saved VNs..." : "保存したVNを検索…"}
                onChange={(e)=>setInput(e.target.value)} onKeyDown={handleKey}
                />
                <button onClick={handleSearch}>{lang==="eng"?"Search":"検索"}</button>
            </header>

            <div className={styles.savedList}>
                {displayedVNs.map((vn) => {
                    const blocked = !vn.safe && !ofAge && !revealed.includes(vn.id);
                    return (
                    <div key={vn.id} className={styles.card}>
                        <Link href={`/vn/${vn.id}`}>
                        <div className={styles.cover}>
                            {blocked ? (
                                <div className={styles.nsfw}>
                                    <p>
                                    {lang === "eng" ? "Sexual content" : "性的コンテンツ"}
                                    </p>
                            
                                    <button onClick={() => setRevealed(prev => [...prev, vn.id])}>
                                        {lang === "eng" ? "View anyway" : "表示する"} 
                                    </button>
                                </div>
                            ) : (
                                <img src={vn.cover} />
                            )}
                        </div>
                        <p className={styles.title}>{lang === "eng" ? vn.enname : vn.jpname}</p>
                        </Link>
                    </div>
                )})}
            </div>

            {displayedVNs.length > 0 && (
            <div className={styles.pagination}>
                <button
                disabled={page===1}
                onClick={()=>setPage(p=>p-1)}
                >
                ←
                </button>
            
                <span>{page} / {pages}</span>
            
                <button
                disabled={page===pages}
                onClick={()=>setPage(p=>p+1)}
                >
                →
                </button>
            </div>
            )}
        </div>
    )
}