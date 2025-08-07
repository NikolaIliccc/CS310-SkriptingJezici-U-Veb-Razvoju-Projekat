import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Games = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get('/games')
      .then(res => setGames(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Game List</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {games.map(game => (
          <div key={game._id} className="p-4 border rounded shadow">
            <h3 className="text-xl font-bold">{game.title}</h3>
            <p>{game.genre} - {game.platform}</p>
            <Link to={`/games/${game._id}`} className="text-blue-600 hover:underline">Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
