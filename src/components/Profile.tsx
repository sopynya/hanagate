import { useState } from "react";
import styles from "./profile.module.css";
import { useUStore } from "@/store/userStore";
interface Props {
    param: string;
}
interface Profile {
    username: string
    name: string;
    avatar: string;
    description: string | null;
    vndbUrl: string | null;
    githubUrl: string | null;
    twitterUrl: string | null;
}

export default function Profile({param}: Props) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [section, setSection] = useState("overview");
    const lang = useUStore((s) => s.language);
    if (!profile) {
        return(
            <div>

            </div>
        )
    }
    return(
        <div className={styles.page}>
            <header>
                <img src={profile.avatar} />
                <div className={styles.header}>
                    <p className={styles.name}>{profile.name}</p>
                    <p className={styles.username}>@{profile.username}</p>
                </div>
            </header>
            <nav>
                <button>Overview</button>
                <button>Read</button>
                <button>Reading</button>
                <button>Plan to read</button>
                <button>Dropped</button>
                <button>Reviews</button>
            </nav>
            {section === "overview" &&
                <main className={styles.overview}>
                    <div className={styles.info}>
                        <p>{profile.description || lang === "eng" ? 'User has no description.' : ''}</p>
                        <p>
                            {profile.vndbUrl && <a href={profile.vndbUrl}>VNDB</a>}
                            {profile.twitterUrl && <a href={profile.twitterUrl}>Twitter</a>}
                            {profile.githubUrl && <a href={profile.githubUrl}>GitHub</a>}
                        </p>
                    </div>
                    <div className={styles.stats}>

                    </div>
                </main>
            }
        </div>
    )
}