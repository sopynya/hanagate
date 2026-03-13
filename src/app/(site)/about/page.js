"use client"
import styles from './page.module.css'
import { useUserStore } from "@/store/userStore";
export default function AboutPage() {
    const lang = useUserStore(s => s.language);
    return(
        <div className={styles.bg}>
            <div className={styles.page}>
                <h1>{lang === "eng"? "About This Website" : "このウェブサイトについて"}</h1>
                <section className={styles.section}>

                    <h2>{lang === "eng" ? "The Goal of This Website" : "このサイトの目的"}</h2>

                    <p>
                        {lang === "eng"
                        ? `The main goal of this website is to celebrate visual novels and the culture surrounding them. Visual novels are not only games but also a unique storytelling medium combining art, music, and writing.`
                        : `このサイトの主な目的は、ビジュアルノベルとその文化を紹介することです。ビジュアルノベルは単なるゲームではなく、アート、音楽、文章が組み合わさった独特の物語体験です。`}
                    </p>

                    <p>
                        {lang === "eng"
                        ? `The project is also inspired by the concept of "moe". Moe refers to the emotional attachment and affection people feel toward characters and stories. Many visual novels focus on charming characters, warm moments, and emotional storytelling.`
                        : `このプロジェクトは「萌え」という概念にも影響を受けています。萌えとは、キャラクターや物語に対して感じる愛着や感情的なつながりを表す言葉です。多くのビジュアルノベルは、魅力的なキャラクターや心温まる物語を中心に作られています。`}
                    </p>

                    <p>
                        {lang === "eng"
                        ? `This website aims to create a small community space where people who enjoy those stories can discover new titles and share their experiences.`
                        : `このサイトは、そのような物語を楽しむ人たちが新しい作品を見つけたり、体験を共有したりできる小さなコミュニティの場を作ることを目指しています。`}
                    </p>

                </section>
                <section className={styles.section}>
                    <h2>{lang === "eng" ? "Website Features" : "サイトの機能"}</h2>
                    <ul>
                        <li>{lang === "eng" ? "Create a personal user profile" : "ユーザープロフィールの作成"}</li>
                        <li>{lang === "eng" ? "Browse visual novels" : "ビジュアルノベルの閲覧"}</li>
                        <li>{lang === "eng" ? "Mark visual novels as read" : "既読のビジュアルノベルを記録"}</li>
                        <li>{lang === "eng" ? "Save visual novels to read later" : "後で読むための保存機能"}</li>
                        <li>{lang === "eng" ? "Create a list of favorite visual novels" : "お気に入りリスト"}</li>
                        <li>{lang === "eng" ? "Write reviews and share opinions" : "レビューを書く"}</li>
                        <li>{lang === "eng" ? "Discover random visual novels" : "ランダム作品の発見"}</li>
                    </ul>
                </section>

                <section className={styles.section}>

                    <h2>{lang === "eng" ? "Where the Information Comes From" : "情報の出典"}</h2>

                    <p>
                        {lang === "eng"
                        ? `The information about visual novels shown on this website comes from publicly available sources and community knowledge. Titles, images, and general information are collected and organized so that users can easily browse different visual novels.`
                        : `このサイトに掲載されているビジュアルノベルの情報は、公開されている資料やコミュニティの知識をもとに整理されたものです。タイトルや画像、基本情報などをまとめ、ユーザーが作品を簡単に探せるようにしています。`}
                    </p>

                    <p>
                        {lang === "eng"
                        ? `This website was heavily inspired by VNDB (vndb.org), a well-known visual novel database created and maintained by the community.`
                        : `このサイトは、コミュニティによって作られ運営されている有名なビジュアルノベルデータベース「VNDB (vndb.org)」から大きな影響を受けています。`}
                    </p>

                    <p>
                        {lang === "eng"
                            ? `All visual novels and images belong to their respective creators, studios, and publishers. This website does not claim ownership of the original works.`
                            : `すべてのビジュアルノベルおよび画像の権利は、それぞれの制作会社・出版社・クリエイターに帰属します。このサイトはそれらの権利を主張するものではありません。`}
                    </p>

                </section>
                <section className={styles.section}>
                    <h2>{lang === "eng" ? "How This Website Was Created" : "このサイトはどのように作られたのか"}</h2>
                    <p>
                        {lang === "eng" ? 
                            `This website was developed as a full-stack web 
                            application using modern web technologies. The goal was to 
                            create a simple but functional platform where users can keep 
                            track of the visual novels they read and discover new ones.` :
                            `このウェブサイトは、現代的なウェブ技術を使用したフルスタックアプリケーションとして開発されました。
                            ユーザーが読んだビジュアルノベルを記録し、
                            新しい作品を見つけられるシンプルで使いやすいプラットフォームを作ることを目標にしています。`
                        }
                    </p>

                    <p>
                        {lang === "eng"
                            ? `The design of the website is inspired by early 2000s anime and visual novel websites. During that time, many fan sites had soft colors, simple layouts, and a nostalgic aesthetic. This site intentionally uses light pink tones and rounded fonts to recreate that atmosphere.`
                            : `サイトのデザインは、2000年代初期のアニメやビジュアルノベルのウェブサイトからインスピレーションを受けています。当時のファンサイトは柔らかい色使いとシンプルなレイアウトが特徴で、どこか懐かしい雰囲気がありました。このサイトでは淡いピンク色や丸みのあるフォントを使い、その雰囲気を再現しています。`}
                    </p>
                </section>

                <section >
                    <h2>{lang === "eng" ? "Contact" : "連絡先"}</h2>
                    <p>{lang === "eng" ? "If you have questions, suggestions, or feedback about the website, feel free to contact me." : "サイトについての質問や提案があれば、お気軽にご連絡ください。"}</p>
                    <p>Email: <b>sophiatrindade734@gmail.com</b></p>
                </section>

            </div>
        </div>
    )
}