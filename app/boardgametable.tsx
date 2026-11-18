import React, { useState, useEffect } from 'react';

interface BoardGame {
    id: string;
    name: string;
    year: string;
    thumbnail: string;
    description: string;
    rating: string;
}
function decodeHtml(text: string) {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent || '';
} 

function BoardGameTable() {
    const [games, setGames] = useState<BoardGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState<BoardGame | null>(null);

    useEffect(() => {
        const fetchBggGames = async () => {
            try {
                const response = await fetch('/api/bgg');
                const xmlText = await response.text();

                console.log("raw XML from BGG:", xmlText);

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

                const itemNodes = xmlDoc.querySelectorAll('item');
                console.log("Found Items", itemNodes.length);

                const parsedGames = Array.from(itemNodes).map((item) => {
                    return {
                        id: item.getAttribute('id') || '',
                        name: item.querySelector('name')?.getAttribute('value') || 'Unknown',
                        year: item.querySelector('yearpublished')?.getAttribute('value') || 'N/A',
                        thumbnail: item.querySelector('thumbnail')?.getAttribute('value') ||'',
                        description: decodeHtml(item.querySelector('description')?.textContent || ''),
                        rating: '',
                    };
                });

                setGames(parsedGames);
                setLoading(false);

                const ids = parsedGames.map((g) => g.id);
                const chunks: string[][] = [];
                for (let i = 0; i < ids.length; i += 20) {
                    chunks.push(ids.slice(i, i + 20));
                }

                const details = new Map<string, { description: string; rating: string }>();

                for (const chunk of chunks) {
                    const res = await fetch(`/api/bgg/thing?ids=${chunk.join(',')}`);
                    if (!res.ok) break;

                    const xml = await res.text();
                    const doc = new DOMParser().parseFromString(xml, 'text/xml');

                    doc.querySelectorAll('item').forEach((item) => {
                        details.set(item.getAttribute('id') || '', {
                            description: decodeHtml(item.querySelector('description')?.textContent || ''),
                            rating: item.querySelector('statistics ratings average')?.getAttribute('value') || '',
                        });
                    });
                }

                setGames((prev) =>
                    prev.map((game) => ({ ...game, ...details.get(game.id) }))
                );

                
            } catch (error) {
                console.error('error fetching from BGG:', error);
                setLoading(false);
            }
        };

        fetchBggGames();
    }, []);

    if (loading) return <div>Loading board games from BGG...</div>;

    return (
        <div className="table-container p-4">
            <h2 className="mb-4 text-lg font-bold">Popular Board Games</h2>
            <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-slate-800 text-white">
                    <tr>
                        <th className="p-3 w-20">Image</th>
                        <th className="p-3 w-56">Name</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 w-24">Rating</th>
                        <th className="p-3 w-24">Year Published</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id} onClick={() => setSelectedGame(game)} className="cursor-pointer hover:bg-stone-100 border-b border-slate-200">
                            <td className="p-3"><img src={game.thumbnail} alt={game.name} className="w-14 h-14 object-cover rounded" /></td>
                            <td className="p-3 font-semibold">{game.name}</td>
                            <td className="p-3 text-slate-600 text-sm">
                                {game.description.length > 150
                                    ? game.description.slice(0, 150) + '…'
                                    : game.description}
                            </td>
                            <td className="p-3">{game.rating ? Number(game.rating).toFixed(1) : '—'}</td>
                            <td className="p-3">{game.year}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    {selectedGame && (
                        <div
                            className="fixed inset-0 bg-black-50 flex items-center justify-center p-4 z-50 "
                            onClick={() => setSelectedGame(null)} >
                            <div 
                            className="bg-white rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto p-6"
                            onClick={(e) => e.stopPropagation()} >
                                <h3 className="text-2xl font-bold mb-4">{selectedGame.name}</h3>
                                <p className="whitespace-pre-line">{selectedGame.description}</p>
                                <button
                                    onClick={() => setSelectedGame(null)}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                                        Close
                                    </button>
                                </div>
                            </div>

                    )}
                    </div>

    );
}

export default BoardGameTable;