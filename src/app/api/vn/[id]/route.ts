import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

type Character = {
    id: string;
    name: string;
    role: "main" | "primary" | "side" | "appears";
    gender: string | null;
    image: {
        url: string;
    } | null;
    original: string | null;
};

export async function POST(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const res = await fetch('https://api.vndb.org/kana/vn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filters: ["id", "=", id],
                fields: "id, title, alttitle, length, released, tags.id, image.url, developers.name, description, characters.id, characters.name, characters.role, characters.gender, characters.image.url, characters.original",
            }),
        });

        const data = await res.json();
        const vn = data.results[0];
        const characters: Character[] = (vn?.characters ?? []).filter(
            (character: Character) => character.role !== "appears"
        );

        return NextResponse.json({
            ...vn,
            characters
        });
    } catch(error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}