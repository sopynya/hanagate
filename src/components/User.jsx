"use client";
import { useEffect, useState } from "react";
import styles from "./user.module.css";
import novels from "@/data/vn.json";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

export default function User({ username }) {
  const lang = useUserStore((s) => s.language);

  const [profile, setProfile] = useState(null);
  const [color, setColor] = useState("");

  const [read, setRead] = useState([]);
  const [saved, setSaved] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 24;

  const [favPage, setFavPage] = useState(1);
  const [readPage, setReadPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);

  async function load() {
    setLoading(true);

    const res = await fetch(`/api/users/${username}`);
    const data = await res.json();

    setProfile(data.profile);
    setColor(data.color);

    setRead(data.read || []);
    setSaved(data.saved || []);
    setFavorites(data.favorites || []);
    setReviews(data.reviews || []);

    setFavPage(1);
    setReadPage(1);
    setSavedPage(1);
    setReviewPage(1);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [username]);

  function paginate(list, page) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return list.slice(start, end);
  }

  function getVN(id) {
    return novels.find((v) => String(v.id) === String(id));
  }

    if (loading || !profile) {
        return (
        <div className={styles.bg}>
            <div className={styles.loading}>
                <p>{lang==="eng"?"Loading...":"読み込み中..."}</p>
                <img src='/loading.jpg'/>
            </div>
        </div>
        );
    }

  const readVN = read.map((r) => getVN(r.vn_id)).filter(Boolean);
  const savedVN = saved.map((r) => getVN(r.vn_id)).filter(Boolean);
  const favoriteVN = favorites.map((r) => getVN(r.vn_id)).filter(Boolean);

  const favoritePageData = paginate(favoriteVN, favPage);
  const readPageData = paginate(readVN, readPage);
  const savedPageData = paginate(savedVN, savedPage);
  const reviewPageData = paginate(reviews, reviewPage);

  const favTotal = Math.ceil(favoriteVN.length / ITEMS_PER_PAGE);
  const readTotal = Math.ceil(readVN.length / ITEMS_PER_PAGE);
  const savedTotal = Math.ceil(savedVN.length / ITEMS_PER_PAGE);
  const reviewTotal = Math.ceil(reviews.length / ITEMS_PER_PAGE);

  const stats = {
    reviews: reviews.length,
    read: read.length,
    saved: saved.length,
    favorites: favorites.length,
  };

  const t = {
    stats: lang === "eng" ? "Stats" : "統計",
    reviews: lang === "eng" ? "Reviews" : "レビュー",
    read: lang === "eng" ? "Read VNs" : "既読VN",
    saved: lang === "eng" ? "Saved VNs" : "保存VN",
    favorites: lang === "eng" ? "Favorite VNs" : "お気に入りVN",

    reviewsCount: lang === "eng" ? "Reviews" : "レビュー数",
    readCount: lang === "eng" ? "Read" : "既読",
    savedCount: lang === "eng" ? "Saved" : "保存",
    favoritesCount: lang === "eng" ? "Favorites" : "お気に入り",
  };

  const emptyText = {
    favorites:
      lang === "eng"
        ? "This user has no favorite visual novels yet."
        : "このユーザーはまだお気に入りのビジュアルノベルがありません。",

    read:
      lang === "eng"
        ? "This user hasn't marked any visual novels as read."
        : "このユーザーはまだ既読のビジュアルノベルがありません。",

    saved:
      lang === "eng"
        ? "This user hasn't saved any visual novels."
        : "このユーザーはまだビジュアルノベルを保存していません。",

    reviews:
      lang === "eng"
        ? "This user hasn't written any reviews yet."
        : "このユーザーはまだレビューを書いていません。",
  };

  function Pagination({ page, setPage, total }) {
    if (total <= 1) return null;

    return (
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ◀
        </button>

        <span>
          {page} / {total}
        </span>

        <button disabled={page === total} onClick={() => setPage(page + 1)}>
          ▶
        </button>
      </div>
    );
  }

  return (
    <div className={styles.bg}>
      <div className={styles.page} data-color={color}>
        <header className={styles.header}>
          <img src={profile.avatar} />
          <div>
            <h1>{profile.name}</h1>
            <p>@{username}</p>
          </div>
        </header>

        {profile.description && <p className={styles.description}>{profile.description}</p>}

        <div className={styles.statsBox}>
          <h2>{t.stats}</h2>

          <table className={styles.statsTable}>
            <tbody>
              <tr>
                <td>{t.reviewsCount}</td>
                <td>{stats.reviews}</td>
              </tr>
              <tr>
                <td>{t.readCount}</td>
                <td>{stats.read}</td>
              </tr>
              <tr>
                <td>{t.savedCount}</td>
                <td>{stats.saved}</td>
              </tr>
              <tr>
                <td>{t.favoritesCount}</td>
                <td>{stats.favorites}</td>
              </tr>
            </tbody>
          </table>
        </div>


        <div className={styles.section}>
          <h2>{t.favorites}</h2>

          {favoriteVN.length === 0 ? (
            <p className={styles.empty}>{emptyText.favorites}</p>
          ) : (
            <>
              <div className={styles.vnList}>
                {favoritePageData.map((vn) => (
                  <div key={vn.id} className={styles.vnCard}>
                    <Link href={`/vn/${vn.id}`}>
                    <img src={vn.cover} />
                    <p>{lang === "eng" ? vn?.enname : vn?.jpname}</p>
                    </Link>
                  </div>
                ))}
              </div>

              <Pagination
                page={favPage}
                setPage={setFavPage}
                total={favTotal}
              />
            </>
          )}
        </div>


        <div className={styles.section}>
          <h2>{t.read}</h2>

          {readVN.length === 0 ? (
            <p className={styles.empty}>{emptyText.read}</p>
          ) : (
            <>
              <div className={styles.vnList}>
                {readPageData.map((vn) => (
                  <div key={vn.id} className={styles.vnCard}>
                    <Link href={`/vn/${vn.id}`}>
                    <img src={vn.cover} />
                    <p>{lang === "eng" ? vn?.enname : vn?.jpname}</p>
                    </Link>
                  </div>
                ))}
              </div>

              <Pagination
                page={readPage}
                setPage={setReadPage}
                total={readTotal}
              />
            </>
          )}
        </div>

        <div className={styles.section}>
          <h2>{t.saved}</h2>

          {savedVN.length === 0 ? (
            <p className={styles.empty}>{emptyText.saved}</p>
          ) : (
            <>
              <div className={styles.vnList}>
                {savedPageData.map((vn) => (
                  <div key={vn.id} className={styles.vnCard}>
                    <Link href={`/vn/${vn.id}`}>
                    <img src={vn.cover} />
                    <p>{lang === "eng" ? vn?.enname : vn?.jpname}</p>
                    </Link>
                  </div>
                ))}
              </div>

              <Pagination
                page={savedPage}
                setPage={setSavedPage}
                total={savedTotal}
              />
            </>
          )}
        </div>


        <div className={styles.section}>
          <h2>{t.reviews}</h2>

          {reviews.length === 0 ? (
            <p className={styles.empty}>{emptyText.reviews}</p>
          ) : (
            <>
              {reviewPageData.map((r) => {
                const vn = getVN(r.vn_id);

                return (
                  <div key={r.id} className={styles.review}>
                    <Link href={`/vn/${vn.id}`}>
                    <img src={vn?.cover} />
                    </Link>
                    <div className={styles.reviewHeader}>
                      <p className={styles.vnTitle}>{lang === "eng" ? vn?.enname : vn?.jpname}</p>
                      <p className={styles.vote}>★ {r.vote}/10 ★</p>
                      <hr />
                      <p className={styles.reviewText}>{r.review}</p>
                    </div>
                  </div>
                );
              })}

              <Pagination
                page={reviewPage}
                setPage={setReviewPage}
                total={reviewTotal}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}