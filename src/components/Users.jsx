"use client";
import { useState,useEffect } from "react"
import styles from "./users.module.css"
import { useUserStore } from '@/store/userStore';
import Link from "next/link";
export default function Users() {
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(true);
    const [page,setPage] = useState(1);
    const [total,setTotal] = useState(0);
    const lang = useUserStore(s => s.language);
    const [input,setInput] = useState("");
    const [search,setSearch] = useState("");

    const pages = Math.ceil(total/20)

    async function load() {
        setLoading(true);
        const res = await fetch(`/api/users?page=${page}&search=${encodeURIComponent(search)}`);
        const data = await res.json();

        setUsers(data.users);
        setTotal(data.total);

        setLoading(false);
    }

    useEffect(()=>{
        load()
    },[page, search]);

    function handleSearch(){
        setPage(1);
        setSearch(input);
    }

    function handleKey(e){
        if(e.key === "Enter"){
            handleSearch();
        }
    }
    return(
        <div className={styles.page}>
            <header className={styles.header}>
                <input type='search' value={input} placeholder={lang==="eng"?"Search users...":"ユーザー検索..."}
                 onChange={(e)=>setInput(e.target.value)} onKeyDown={handleKey}/>
                <button onClick={handleSearch}>{lang==="eng"?"Search":"検索"}</button>
            </header>

            {loading ? (
                <div className={styles.loading}>
                    <p>{lang==="eng"?"Loading...":"読み込み中..."}</p>
                    <img src='/loading.jpg'/>
                </div>
            ): (
                <div className={styles.list}>
                    {users.map(u => (
                        <div key={u.id}> 
                            <Link href={`/users/${u.username}`} className={styles.user} data-color={u.color}>
                                <img src={u.avatar} />
                                <div>
                                    <h3>{u.name}</h3>
                                    <p className={styles.username}>@{u.username}</p>
                                    {u.description && <p className={styles.description}>{u.description}</p>}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {users.length > 0 && !loading && (
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