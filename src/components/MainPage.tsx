"use client"
import { useState, useEffect, KeyboardEvent } from "react";
import { useUStore } from "@/store/userStore";
import { Tags } from "./tags";
import styles from "./main.module.css";
import Link from "next/link";

interface VN {
    id: string,
    title: string,
    alttitle?: string,
    image?: {
        url: string;
    }
}
export default function MainPage() {
    const [more, setMore] = useState(false);
    const [vns, setVns] = useState<VN[]>([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<String[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const lang = useUStore((s) => s.language);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadVn() {
            setError(false);
            setLoading(true);
            try {
                const res = await fetch("/api/vn", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        searchTerm, filters, page
                    })
                });
                const data = await res.json();
                setVns(data.results);
                setMore(data.more);
            } catch (error) {
                console.error(error)
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        loadVn();
    }, [page, searchTerm, filters]);

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (search.trim()) {
                setSearchTerm(search.trim());
            }
        }
    }

    return(
        <div className={styles.page}>
            <header className={styles.header}>
                <input type="search" placeholder={lang === 'eng' ? "Search..." : "検索..."} value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch}/>
                <button className={styles.showFilter} onClick={() => setShowFilter(!showFilter)}>{lang === 'eng' ? "Filter" : "フィルター"}</button>
                {showFilter && (
                    <div className={styles.tags}>
                
                        {Tags.map(tag => {
                            const tagName = lang === "eng" ? tag.eng : tag.jp;
                            return (
                                <button 
                                key={tag.id} 
                                className={filters.includes(tag.id) ? styles.activeTag : ""}
                                onClick={() => setFilters(prev => prev.includes(tag.id) ? prev.filter(t => t !== tag.id) : [...prev, tag.id] )}
                                >
                                    {tagName}
                                </button>
                            )
                        })}
                    </div>
                )}
            </header>

            {loading && <img className={styles.loading} src="https://media.tenor.com/VZPYDnEOTbcAAAAj/meikoiu-miku.gif"/>}

            <main className={styles.main}>
                {!loading && !error && vns.map((vn) => {
                    const vnLang = lang === "eng" ? vn.title : vn.alttitle ? vn.alttitle : vn.title;
                    return (
                        <Link key={vn.id} href={`/${vn.id}`}>
                            <div className={styles.card}>
                                <img src={vn.image?.url} loading="lazy" alt={vn.title}/>
                                <p>{vnLang}</p>
                            </div>
                        </Link>
                    )
                })}
            </main>

            {!loading && !error &&
                <div className={styles.pagination}>
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}>←</button>
                    <p>{page}</p>
                    <button disabled={!more} onClick={() => setPage(more ? page + 1 : page)}>→</button>
                </div>
            }
        </div>
    );
}