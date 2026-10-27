import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { searchTerm, filters, page } = await request.json();

        const res = await fetch('https://api.vndb.org/kana/vn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filters: ["and", ["search", "=", searchTerm || ""], ...filters.map((id: String) => ["tag", "=", id])],
                fields: "id, title, alttitle, image.url, image.sexual",
                sort: "rating",
                reverse: true,
                results: 24,
                page: page || 1
            }),
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
