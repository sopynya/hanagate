"use client";
import { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { useUserStore } from "@/store/userStore";
import avatarsData from "@/data/avatar.json";
import novels from "@/data/vn.json";
import characters from "@/data/characters.json";
import Loading from "./Loading"
const ITEMS_PER_PAGE = 10;

export default function Settings() {
  const lang = useUserStore(s => s.language);
  const setConfigZustand = useUserStore(s => s.hydrate); 
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [config, setConfig] = useState({});
  const [avatarSearch, setAvatarSearch] = useState("");
  const [avatarPage, setAvatarPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    description: "",
    avatar: ""
  });
  const [configInputs, setConfigInputs] = useState({
    color: "pink",
    ofAge: false,
    language: "eng",
    page: 60,
    order: "read",
  });

  async function loadSettings() {
    setLoading(true);
    const res = await fetch("/api/settings");
    const data = await res.json();

    setProfile(data.profile);
    setConfig(data.config);

    setInputs({
      name: data.profile.name || "",
      username: data.profile.username || "",
      description: data.profile.description || "",
      avatar: data.profile.avatar || ""
    });

    setConfigInputs({
      color: data.config.color || "pink",
      ofAge: data.config.ofAge || false,
      language: data.config.language || "eng",
      page: data.config.page || 60,
      order: data.config.order || "read",
    });

    setLoading(false);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    if (name in inputs) setInputs({ ...inputs, [name]: value });
    if (name in configInputs) {
      const val = type === "checkbox" ? checked : value;
      setConfigInputs({ ...configInputs, [name]: val });
    }
  }

  async function saveSettings() {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userData: inputs, config: configInputs }),
    });
    const data = await res.json();
    setProfile(data.profile);
    setConfig(data.config);
    setConfigZustand(data);
    setSaving(false);
  }


  const filteredAvatars = avatarsData.filter(a => {
  const vn = novels.find(v => v.id === a.vn_id);
  const character = characters.find(c => c.id === a.character_id);
  if (!vn) return false;
  return (
    vn.enname.toLowerCase().includes(avatarSearch.toLowerCase()) ||
    vn.jpname.includes(avatarSearch) ||
    character?.enname.toLowerCase().includes(avatarSearch.toLowerCase()) ||
    character?.jpname.includes(avatarSearch)
  );
});
  const totalAvatarPages = Math.ceil(filteredAvatars.length / ITEMS_PER_PAGE);
  const displayedAvatars = filteredAvatars.slice(
    (avatarPage - 1) * ITEMS_PER_PAGE,
    avatarPage * ITEMS_PER_PAGE
  );

  function handleAvatarSelect(link) {
    setInputs({ ...inputs, avatar: link });
  }

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: "include"
      });
      if (!res.ok) throw new Error("Error logging out");
      window.location.href = "/login"
    } catch(err) {
      console.log(err.message)
    }

  }
  if (loading) return (
    <Loading />
  );
  

  return (
    <div className={styles.bg}>
      <div className={styles.page} data-color={configInputs.color}>
        <h1>{lang === "eng" ? "Settings" : "設定"}</h1>

        <section className={styles.section}>
          <h2>{lang === "eng" ? "Profile" : "プロフィール"}</h2>
          <label>{lang === "eng" ? "Name:" : "名前:"}</label>
          <input className={styles.input} name="name" value={inputs.name} onChange={handleInputChange} />

          <label>{lang === "eng" ? "Username:" : "ユーザー名:"}</label>
          <input className={styles.input} name="username" value={inputs.username} onChange={handleInputChange} />

          <label>{lang === "eng" ? "Description:" : "説明:"}</label>
          <textarea name="description" value={inputs.description} onChange={handleInputChange} />
        </section>

        <section className={styles.section}>
          <h2>{lang === "eng" ? "Configuration" : "設定"}</h2>

          <label>{lang === "eng" ? "Color:" : "カラー:"}</label>
          <div className={styles.colorPicker}>
            {["pink", "blue", "yellow", "green", "purple", "red", "black"].map(c => (
              <div
                key={c}
                className={`${styles.colorDot} ${configInputs.color === c ? styles.selected : ""}`}
                style={{ backgroundColor: c }}
                onClick={() => setConfigInputs({ ...configInputs, color: c })}
              ></div>
            ))}
          </div>

          <label className={styles.adult}>
            {lang === "eng" ? "Adult Content" : "成人向けコンテンツ"}
            <input
              type="checkbox"
              name="ofAge"
              checked={configInputs.ofAge}
              onChange={handleInputChange}
            />
            
          </label>

          <label>{lang === "eng" ? "Language:" : "言語:"}</label>
          <select name="language" value={configInputs.language} onChange={handleInputChange}>
            <option value="eng">{lang === "eng" ? "English" : "英語"}</option>
            <option value="jp">{lang === "eng" ? "Japanese" : "日本語"}</option>
          </select>

          <label>{lang === "eng" ? "Page Items:" : "1ページあたり:"}</label>
          <input type="number" name="page" value={configInputs.page} onChange={handleInputChange} />

          <label>{lang === "eng" ? "Order:" : "表示順:"}</label>
          <select name="order" value={configInputs.order} onChange={handleInputChange}>
            <option value="read">{lang === "eng" ? "Read" : "既読順"}</option>
            <option value="saved">{lang === "eng" ? "Saved" : "保存順"}</option>
            <option value="favorites">{lang === "eng" ? "Favorites" : "お気に入り順"}</option>
          </select>
        </section>

        <section className={styles.section}>
          <h2>{lang === "eng" ? "Select Avatar" : "アバター選択"}</h2>
          <input
            type="search" className={styles.input}
            placeholder={lang === "eng" ? "Search VNs or Characters..." : "VNやキャラクター検索..."}
            value={avatarSearch}
            onChange={e => setAvatarSearch(e.target.value)}
          />
          <div className={styles.avatarGrid}>
            {displayedAvatars.map(a => (
              <img
                key={a.id}
                src={a.link}
                className={inputs.avatar === a.link ? `${styles.avatar} ${styles.active}` : styles.avatar}
                onClick={() => handleAvatarSelect(a.link)}
              />
            ))}
          </div>
          {totalAvatarPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={avatarPage === 1} onClick={() => setAvatarPage(p => p - 1)}>
                ←
              </button>
              <span>
                {avatarPage} / {totalAvatarPages}
              </span>
              <button disabled={avatarPage === totalAvatarPages} onClick={() => setAvatarPage(p => p + 1)}>
                →
              </button>
            </div>
          )}
        </section>

        <button className={styles.saveBtn} onClick={saveSettings} disabled={saving}>
          {saving
          ? lang === "eng"
            ? "Saving..."
            : "保存中..."
          : lang === "eng"
          ? "Save Settings"
          : "設定を保存"}
        </button>

        <p className={styles.logout} onClick={handleLogout}>Logout</p>
      </div>
    </div>
  );
}