"use client";
import { useState, useEffect, useMemo } from "react";
import novels from '@/data/vn.json'
import styles from "./main.module.css";
import { useUserStore } from '@/store/userStore';
import Link from "next/link";

const tagGroups = {
  general: [
    { eng: "romance", jp: "恋愛" },
    { eng: "drama", jp: "ドラマ" },
    { eng: "comedy", jp: "コメディ" },
    { eng: "mystery", jp: "ミステリー" },
    { eng: "horror", jp: "ホラー" },
    { eng: "slice of life", jp: "日常" },
    { eng: "action", jp: "アクション" },
    { eng: "fantasy", jp: "ファンタジー" },
    { eng: "sci-fi", jp: "SF" },
    { eng: "violence", jp: "暴力表現" },
    { eng: "crime", jp: "犯罪" },
    { eng: "gore", jp: "ゴア" },
    { eng: "psychological", jp: "心理" },
    { eng: "thriller", jp: "スリラ" },
    { eng: "suspense", jp: "サスペンス" },
    { eng: "mecha", jp: "メカ" }
  ],

  route: [
    { eng: "multiple routes", jp: "複数ルート" },
    { eng: "single route", jp: "単一ルート" }
  ],

  adult: [
    { eng: "none", jp: "なし" },
    { eng: "sexual content", jp: "性的表現" }
  ],

  playtime: [
    { eng: "short", jp: "短い" },
    { eng: "medium", jp: "中" },
    { eng: "long", jp: "長い" }
  ]
};

export default function Main() {
    const lang = useUserStore(s => s.language);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const itemsPerPage = useUserStore(s => s.page);
    const setPageSize = useUserStore(s => s.setPage);
    const ofAge = useUserStore(s => s.ofage);
    const [page, setPage] = useState(1);
    const [revealed, setRevealed] = useState([]);
    const order = useUserStore(s => s.order);
    const setOrder = useUserStore(s => s.setOrder);
    const [readStats, setReadStats] = useState({});
    const [starStats, setStarStats] = useState({});

    useEffect(() => {
        async function loadStats() {
            const res = await fetch("/api/vn-stats");
            const data = await res.json();

            const readMap = {};
            const starMap = {};
            data.reads.forEach(r => {
                readMap[r.vn_id] = Number(r.total);
            });

            data.stars.forEach(s => {
                starMap[s.vn_id] = {
                    average: Number(s.average),
                    total: Number(s.total)
                };
            });

            setReadStats(readMap)
            setStarStats(starMap);
        }
        loadStats();
    }, [])

    const filteredVNs = useMemo(() => {
        let result = novels;
        if (searchTerm) {
            result = result.filter(vn => (
                vn.enname + vn.jpname
            ).toLowerCase().includes(searchTerm.toLowerCase()));

        }
        if (selectedTags.length > 0) {
            if (selectedTags.includes("none")) {
                result = result.filter(vn =>
                    !vn.categories.includes("sexual content")
                );
            }
            result = result.filter(vn =>
                selectedTags.every(tag =>
                    tag === "none" || vn.categories.includes(tag)
                )
            );
        }

        if(order === "alphabetical"){
            result = [...result].sort((a,b) =>
                a.enname.localeCompare(b.enname)
            );

        }

        if(order === "read"){

        result = [...result].sort((a,b) =>
            (readStats[b.id] || 0) - (readStats[a.id] || 0)
        );

        }

        if(order === "stars"){
            result = [...result].sort((a,b) =>
                (starStats[b.id]?.average || 0) - (starStats[a.id]?.average || 0)
            );
        }

        return result;
    }, [searchTerm, selectedTags]);

    const totalPages = Math.ceil(filteredVNs.length / itemsPerPage);
    const paginated = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredVNs.slice(start, start + itemsPerPage);
    }, [filteredVNs, page, itemsPerPage]);


    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <input type='search' placeholder={lang === 'eng' ? "Search..." : "検索..."} value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}/>
                <button onClick={() => setShowFilter(!showFilter)}>{lang === 'eng' ? "Filter" : "フィルター"}</button>
                {showFilter && (
                    <div className={styles.tagsmodal}>
                        <div className={styles.pageControl}>
                            <h3>{lang === "eng" ? "Number of items" : "表示件数"}</h3>
                            <button className={itemsPerPage === 60 ? styles.activePage : ""} onClick={() => setPageSize(60)}>60</button>
                            <button className={itemsPerPage === 120 ? styles.activePage : ""} onClick={() => setPageSize(120)}>120</button>
                            <button className={itemsPerPage === 240 ? styles.activePage : ""} onClick={() => setPageSize(240)}>240</button>
                        </div>
                        <div className={styles.orderButtons}>
                            <h3>{lang === "eng" ? "Sort by" : "並び替え"}</h3>
                        <button
                            onClick={() => setOrder('read')}
                            className={order === 'read' ? styles.activeOrder : ''}
                        >
                            {lang === 'eng' ? 'Most Saved' : '保存数'}
                        </button>

                        <button
                            onClick={() => setOrder('alphabetical')}
                            className={order === 'alphabetical' ? styles.activeOrder : ''}
                        >
                            {lang === 'eng' ? 'Alphabetical' : 'アルファベット順'}
                        </button>

                        <button
                            onClick={() => setOrder('stars')}
                            className={order === 'stars' ? styles.activeOrder : ''}
                        >
                            {lang === 'eng' ? 'Most Stars' : '星評価'}
                        </button>

                        </div>
                        {Object.entries(tagGroups).map(([key, tags]) => (
                            <div key={key} className={styles.tagGroup}>

                                <h3>
                                    {lang === "eng" ? key : {
                                    general: "一般",
                                    route: "ルート",
                                    adult: "成人向け",
                                    playtime: "プレイ時間"
                                    }[key]
                                    }
                                </h3>

                                <div className={styles.tags}>
                                    {tags.map(tag => {
                                        const tagName = lang === "eng" ? tag.eng : tag.jp;

                                        return (
                                            <button
                                                key={tag.eng}
                                                className={selectedTags.includes(tag.eng) ? styles.activeTag : ""}
                                                onClick={() =>
                                                    setSelectedTags(prev =>
                                                        prev.includes(tag.eng)
                                                        ? prev.filter(t => t !== tag.eng)
                                                        : [...prev, tag.eng]
                                                    )
                                                }
                                            >
                                                {tagName}
                                            </button>
                                        );
                                    })}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </header>



            <div className={styles.vnlist}>
                {paginated.map(vn => {
                    const title = lang === "eng" ? vn.enname : vn.jpname;
                    const blocked = !ofAge && !vn.safe && !revealed.includes(vn.id);

                    return(
                        <div key={vn.id} className={styles.vncard}>
                            <Link href={`/vn/${vn.id}`}>
                            <div className={styles.cover}>
                                {blocked ? (
                                    <div className={styles.nsfw}>
                                        <p>
                                            {lang === "eng" ? "Sexual content" : "性的コンテンツ"}
                                        </p>

                                        <button
                                            onClick={() =>
                                                setRevealed(prev => [...prev, vn.id])
                                            }
                                        >
                                        {lang === "eng" ? "View anyway" : "表示する"} </button>
                                    </div>
                                ) : (
                                    <img src={vn.cover} alt={title} />
                                )}
                            </div>

                            <h4>{title}</h4>
                            </Link>
                        </div>
                    )
                })}
            </div>
            <div className={styles.pagination}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >←</button>
                <span>
                    {page} / {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    >
                    →
                </button>
            </div>
        </div>
    )
}