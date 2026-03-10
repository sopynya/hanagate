"use client"
import styles from './vnpage.module.css';
import chara from '@/data/characters.json'
export default function VnCharacters({vnId, lang}) {
    const characters = chara.filter(c => c.vn_id === Number(vnId));

    return(
        <div className={styles.characters}>
            {characters.map((ch) => (
                <div key={ch.id} className={styles.character}>
                    <img src={ch.image} />
                    <h4>{lang === "eng" ? ch.enname : ch.jpname} </h4>
                    <p style={{color: ch.gender === "♂️" ? "#5992e9" : ch.gender === "♀️" ? "#e9398b" : "gray"}}>{lang === "eng" ? ch.role : ch.rolejp} • {ch.gender}</p>
                </div>
            ))}
        </div>
    )
}