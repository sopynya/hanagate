export interface Ltags {
    id: string,
    eng: string,
    jp: string
}

export const Tags = [
    { id: "g12", eng: "action", jp: "アクション" },
    { id: "g98", eng: "yaoi", jp: "BL" },
    { id: "g104", eng: "comedy", jp: "コメディ" },
    { id: "g322", eng: "crime", jp: "犯罪" },
    { id: "g147", eng: "drama", jp: "ドラマ" },
    { id: "g2", eng: "fantasy", jp: "ファンタジー" },
    { id: "g97", eng: "yuri", jp: "百合" },
    { id: "g161", eng: "gore", jp: "ゴア" },
    { id: "g7", eng: "horror", jp: "ホラー" },
    { id: "g99", eng: "incest", jp: "近親相姦" },
    { id: "g377", eng: "mecha", jp: "メカ" },
    { id: "g19", eng: "mystery", jp: "ミステリー" },
    { id: "g235", eng: "no sexual content", jp: "性的な内容なし" },
    { id: "g2821", eng: "open relationship", jp: "オープンな関係" },
    { id: "g253", eng: "psychological", jp: "精神的問題" },
    { id: "g96", eng: "romance", jp: "恋愛" },
    { id: "g105", eng: "science fiction", jp: "SF" },
    { id: "g23", eng: "sexual content", jp: "性的表現" },
    { id: "g454", eng: "slice of life", jp: "日常" },
    { id: "g324", eng: "suspense", jp: "サスペンス" },
    { id: "g789", eng: "thriller", jp: "スリラ" },
    { id: "g157", eng: "violence", jp: "暴力表現" },
] as const;