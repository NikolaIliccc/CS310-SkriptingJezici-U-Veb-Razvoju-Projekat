import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    axios.get(`/games/${id}`)
      .then(res => setGame(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!game) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
      <p><strong>Genre:</strong> {game.genre}</p>
      <p><strong>Platform:</strong> {game.platform}</p>
      <p><strong>Release Date:</strong> {new Date(game.releaseDate).toLocaleDateString()}</p>
      <p className="mt-2">{game.description}</p>
    </div>
  );
};

export default GameDetails;
