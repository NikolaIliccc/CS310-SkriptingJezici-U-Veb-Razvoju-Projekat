import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({ title: '', genre: '', platform: '', releaseDate: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchGames = async () => {
    const res = await axios.get('/games');
    setGames(res.data);
  };

  useEffect(() => { fetchGames(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/games/${editingId}`, form);
      } else {
        await axios.post('/games', form);
      }
      setForm({ title: '', genre: '', platform: '', releaseDate: '', description: '' });
      setEditingId(null);
      fetchGames();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (g) => {
    setEditingId(g._id);
    setForm({ title: g.title, genre: g.genre, platform: g.platform, releaseDate: g.releaseDate?.split('T')[0] || '', description: g.description || '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    await axios.delete(`/games/${id}`);
    fetchGames();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="p-2 border rounded" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input className="p-2 border rounded" placeholder="Genre" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} required />
          <input className="p-2 border rounded" placeholder="Platform" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} required />
          <input className="p-2 border rounded" type="date" value={form.releaseDate} onChange={e => setForm({ ...form, releaseDate: e.target.value })} required />
        </div>
        <textarea className="w-full border rounded mt-3 p-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div className="mt-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Create'}</button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {games.map(g => (
          <div key={g._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{g.title}</h3>
              <p className="text-sm text-gray-600">{g.genre} • {g.platform}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(g)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(g._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
