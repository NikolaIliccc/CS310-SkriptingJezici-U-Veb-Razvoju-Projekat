import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const imageMap = {
  'The Witcher 3: Wild Hunt': '/images/witcher3.jpg',
  'GTA5': '/images/gta5.jpg',
  'Minecraft': '/images/minecraft.jpg',
  'Super Mario Odyssey': '/images/mario.jpg',
  'Elden Ring' : 'images/eldenring.jpg',
  'Portal 2' : 'images/portal2.jpg'
};

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/games')
      .then(res => {
        if (Array.isArray(res.data)) setGames(res.data);
        else setGames([]);
      })
      .catch(err => {
        console.error(err);
        setGames([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">🎮 Video Game Library</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.length === 0 && <p className="col-span-full text-center">Nema igara.</p>}
        {games.map(game => (
          <div key={game._id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={imageMap[game.title] || '/images/placeholder.jpg'}
              alt={game.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{game.title}</h2>
              <p className="text-sm text-gray-600">{game.genre} • {game.platform}</p>
              <p className="mt-2 text-gray-700">{game.description?.slice(0, 120)}{game.description?.length > 120 ? '...' : ''}</p>
              <Link to={`/games/${game._id}`} className="text-blue-600 hover:underline mt-3 inline-block">Detalji</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
