"use client";
import { useState, useMemo } from 'react';
import styles from './characters.module.css'
import { useUserStore } from '@/store/userStore';
import char from '@/data/characters.json'
import Link from 'next/link';
export default function Characters() {
    const [showTags, setShowTags] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = useUserStore(s => s.page);
    const lang = useUserStore(s => s.language);
    const [page, setPage] = useState(1);

    const filteredCharacters = useMemo(() => {
        let filtered = char;

        if (selectedTags.length > 0) {
            filtered = filtered.filter(c => {
                const genderMatch = selectedTags.some(tag => tag === c.gender);
                const roleMatch = selectedTags.some(tag => tag === c.role);
                return genderMatch || roleMatch;
            });
        }

        if (searchTerm.trim() !== "") {
            filtered = filtered.filter(c => {
                const name = lang === "eng" ? c.enname : c.jpname;
                return name.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        return filtered;
    }, [searchTerm, selectedTags, lang]);

    const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
    const paginatedCharacters = filteredCharacters.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const toggleTag = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }

    return(
        <div className={styles.page}>
            <header className={styles.header}>
                <input
                    placeholder={lang === "eng" ? "Search for characters..." : "文字を検索…"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setShowTags(!showTags)}>
                    {lang === 'eng' ? "Filter" : "フィルター"}
                </button>

                {showTags && (
                    <div className={styles.tagsmodal}>
                        <div className={styles.tagstype}>
                            <p>{lang === "eng" ? "Gender:" : "性別:"}</p>
                            <button
                                className={selectedTags.includes("♀️") ? styles.activeTag : ""}
                                onClick={() => toggleTag("♀️")}
                            >♀️</button>
                            <button
                                className={selectedTags.includes("♂️") ? styles.activeTag : ""}
                                onClick={() => toggleTag("♂️")}
                            >♂️</button>
                            <button
                                className={selectedTags.includes("?") ? styles.activeTag : ""}
                                onClick={() => toggleTag("?")}
                            >?</button>
                        </div>

                        <div className={styles.tagstype}>
                            <p>{lang === "eng" ? "Role:" : "役割:"}</p>
                            <button
                                className={selectedTags.includes("protagonist") ? styles.activeTag : ""}
                                onClick={() => toggleTag("protagonist")}
                            >{lang === "eng" ? "protagonist" : "主人公"}</button>
                            <button
                                className={selectedTags.includes("hero") ? styles.activeTag : ""}
                                onClick={() => toggleTag("hero")}
                            >{lang === "eng" ? "hero" : "ヒーロー"}</button>
                            <button
                                className={selectedTags.includes("heroine") ? styles.activeTag : ""}
                                onClick={() => toggleTag("heroine")}
                            >{lang === "eng" ? "heroine" : "ヒロイン"}</button>
                            <button
                                className={selectedTags.includes("side character") ? styles.activeTag : ""}
                                onClick={() => toggleTag("side character")}
                            >{lang === "eng" ? "side character" : "脇役"}</button>
                            <button
                                className={selectedTags.includes("villain") ? styles.activeTag : ""}
                                onClick={() => toggleTag("villain")}
                            >{lang === "eng" ? "villain" : "悪役"}</button>
                        </div>
                    </div>
                )}
            </header>

            <div className={styles.list}>
                {paginatedCharacters.map((c, i) => (
                    <div key={i} className={styles.characterCard}>
                        <Link href={`/vn/${c.vn_id}`}>
                        <img src={c.image} alt={lang === "eng" ? c.enname : c.jpname} />
                        <p>{lang === "eng" ? c.enname : c.jpname}</p>
                        <p>{lang === "eng" ? "Gender: " : "性別: "}{c.gender}</p>
                        <p>{lang === "eng" ? "Role: " : "役割: "}{lang === "eng" ? c.role : c.role_jp}</p>
                        </Link>
                    </div>
                ))}
            </div>

            {paginatedCharacters.length > 0 && (
            <div className={styles.pagination}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >←</button>
                <span>
                    {page} / {totalPages || 1}
                </span>
                <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                >→</button>
            </div>
            )}
        </div>
    )
}