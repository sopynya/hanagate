"use client"

import { useEffect,useState } from "react"
import styles from "./reviews.module.css"
export default function Reviews({vnId,user,lang}) {
    const [reviews,setReviews] = useState([]);
    const [loading,setLoading] = useState(true);
    const [page,setPage] = useState(1);
    const [total,setTotal] = useState(0);

    const [vote,setVote] = useState(10);
    const [text,setText] = useState("");
    const [posting,setPosting] = useState(false);

    const pages = Math.ceil(total/6)

    async function load() {
        setLoading(true);
        const res = await fetch(`/api/reviews/${vnId}?page=${page}`);
        const data = await res.json();
        
        setReviews(data.reviews);
        setTotal(data.total);

        setLoading(false);
    }

    useEffect(()=>{
        load()
    },[page,vnId]);

    async function submit(e) {
        e.preventDefault();
        setPosting(true)

        await fetch(`/api/reviews/${vnId}/post`,{
            method:"POST",
            headers:{ "Content-Type":"application/json"},
            body:JSON.stringify({
                vote,
                review:text
            })
        });

        setPosting(false);
        setText("");
        load();
    }

    return(
        <div className={styles.reviews}>
            {user && (
                <form className={styles.reviewForm} onSubmit={submit}>
                    <h3>{lang==="eng"?"Write a Review":"レビューを書く"}</h3>
                    <select value={vote} onChange={e=>setVote(e.target.value)}>
                        {[10,9,8,7,6,5,4,3,2,1].map(n=>(
                            <option key={n} value={n}>{n} ★</option>
                        ))}
                    </select>

                    <textarea
                        placeholder={lang==="eng"?"Your thoughts...":"感想を書いてください..."}
                        value={text} onChange={e=>setText(e.target.value)}
                        maxLength={500}
                    />

                    <button disabled={posting}>
                        {posting
                        ? (lang==="eng"?"Posting...":"投稿中...")
                        : (lang==="eng"?"Post Review":"レビュー投稿")
                        }
                    </button>
                </form>
            )}

            <div className={styles.list}>
                {loading ? (
                    <div className={styles.loading}>
                        <p>Loading...</p>
                    </div>
                ) : reviews.map(r=>(
                    <div key={r.user_id} className={styles.review}>
                        <img src={r.avatar} />
                        <div>
                            <p className={styles.name}>{r.name}</p>
                            <small>@{r.username}</small>
                            <p className={styles.vote}> ★ {r.vote} / 10 ★</p>
                            {r.review && (<p className={styles.userReview}>{r.review}</p>)}
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length > 0 && (
                <div className={styles.pagination}>

                <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>
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
    );
}