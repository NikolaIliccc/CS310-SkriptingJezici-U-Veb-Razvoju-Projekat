import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../api/axios';

const AdminPanel = () => {
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({ title: '', genre: '', platform: '', releaseDate: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchGames = () => {
    axios.get('/games')
      .then(res => setGames(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/games/${editingId}`, form);
      } else {
        await axios.post('/games', form);
      }
      fetchGames();
      setForm({ title: '', genre: '', platform: '', releaseDate: '', description: '' });
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (game) => {
    setEditingId(game._id);
    setForm({
      title: game.title,
      genre: game.genre,
      platform: game.platform,
      releaseDate: game.releaseDate.split('T')[0],
      description: game.description
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`/games/${id}`);
      fetchGames();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-2">{editingId ? 'Edit Game' : 'Add Game'}</h3>
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input" required />
        <input type="text" placeholder="Genre" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} className="input" required />
        <input type="text" placeholder="Platform" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} className="input" required />
        <input type="date" value={form.releaseDate} onChange={e => setForm({ ...form, releaseDate: e.target.value })} className="input" required />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input" />
        <button type="submit" className="btn">{editingId ? 'Update' : 'Create'}</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {games.map(game => (
          <div key={game._id} className="p-4 border rounded shadow">
            <h4 className="font-bold">{game.title}</h4>
            <p>{game.genre} - {game.platform}</p>
            <p>{new Date(game.releaseDate).toLocaleDateString()}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(game)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(game._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
