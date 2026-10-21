import { NextResponse } from "next/server";

export async function GET() {
    try {
        const bggResponse = await fetch('https://boardgamegeek.com/xmlapi2/hot?boardgame');
        const xmlText = await bggResponse.text();

        return new NextResponse(xmlText, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data from BGG' }, { status: 500 });   
    }
}