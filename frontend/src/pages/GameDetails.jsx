import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const GameDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // Učitavanje igre i komentara
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`/games/${id}`);
        setGame(res.data);
      } catch (err) {
        console.error('Greška pri učitavanju igre:', err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error('Greška pri učitavanju komentara:', err);
      }
    };

    fetchGame();
    fetchComments();
  }, [id]);

  // Dodavanje komentara
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      // Ako imamo token u localStorage, axios.defaults već postavlja Authorization header
      await axios.post(
        `/comments/${id}`,
        { text: commentText },
      );

      setCommentText('');
      // Ponovo učitamo komentare nakon dodavanja
      const updatedComments = await axios.get(`/comments/${id}`);
      setComments(updatedComments.data);

    } catch (err) {
      console.error('Greška pri dodavanju komentara:', err);
      alert(err.response?.data?.message || 'Greška pri dodavanju komentara');
    }
  };

  if (!game) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
      <p><strong>Genre:</strong> {game.genre}</p>
      <p><strong>Platform:</strong> {game.platform}</p>
      <p><strong>Release Date:</strong> {new Date(game.releaseDate).toLocaleDateString()}</p>
      <p className="mt-2">{game.description}</p>

      <hr className="my-4" />
      <h3 className="text-xl font-semibold mb-2">Komentari</h3>

      {user ? (
        <form onSubmit={handleAddComment} className="mb-4">
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows="3"
            placeholder="Ostavi svoj komentar..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Dodaj komentar
          </button>
        </form>
      ) : (
        <p className="text-gray-600 mb-4">
          Morate biti ulogovani da biste ostavili komentar.
        </p>
      )}

      {comments.length > 0 ? (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c._id} className="border-b pb-2">
              <strong>{c.user?.username || 'Anon'}:</strong> {c.text}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Još nema komentara.</p>
      )}
    </div>
  );
};

export default GameDetails;
