import React from 'react';

const GameCard = ({ game }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold mb-2">{game.title}</h2>
      <p><strong>Genre:</strong> {game.genre}</p>
      <p><strong>Platform:</strong> {game.platform}</p>
      <p><strong>Release Year:</strong> {game.releaseYear}</p>
    </div>
  );
};

export default GameCard;
