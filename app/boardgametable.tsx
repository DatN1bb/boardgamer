import React, { useState, useEffect } from 'react';

interface BoardGame {
    id: string;
    name: string;
    year: string;
    thumbnail: string;
}

function BoardGameTable() {
    const [games, setGames] = useState<BoardGame[]>([]);
    const [loading, setLoading] = useState(true);

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
                    };
                });

                setGames(parsedGames);
                setLoading(false);
            } catch (error) {
                console.error('error fetching from BGG:', error);
                setLoading(false);
            }
        };

        fetchBggGames();
    }, []);

    if (loading) return <div>Loading board games from BGG...</div>;

    return (
        <div className="table-container">
            <h2>Popular Board Games</h2>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Year Published</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id} onClick={() => console.log('Clicked game:', game.id)}>
                            <td><img src={game.thumbnail} alt={game.name} width="50" /></td>
                            <td>{game.name}</td>
                            <td>{game.year}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    </div>

    );
}

export default BoardGameTable;