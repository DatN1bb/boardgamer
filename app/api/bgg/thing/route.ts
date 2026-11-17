import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const ids = request.nextUrl.searchParams.get('ids');

    if (!ids || !/^\d+(,\d+)*$/.test(ids)) {
        return NextResponse.json({ error: 'Invalid ids' }, { status: 400 });
    }

    try {
        const bggResponse = await fetch(
            `https://boardgamegeek.com/xmlapi2/thing?id=${ids}&stats=1`,
            {
                headers: {
                    'User-Agent': 'BoardGamerApp/1.0 (CV Project)',
                    'Authorization': `Bearer ${process.env.BGG_API_TOKEN}`,
                },
                cache: 'no-store',
            }
        );
        const xmlText = await bggResponse.text();

        return new NextResponse(xmlText, {
            status: bggResponse.status,
            headers: { 'Content-Type': 'application/xml' },
        });
                } catch (error) {
                    return NextResponse.json({ error: 'Failed to fetch data from BGG' }, { status: 500 });
            }
        }