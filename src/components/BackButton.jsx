"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import styles from "./back.module.css";

export default function BackButton(){

    const router = useRouter();
    const lang = useUserStore(s => s.language);

    return (
        <button
            className={styles.back}
            onClick={() => router.back()}
        >
            ← {lang === "eng" ? "Back" : "戻る"}
        </button>
    );
}