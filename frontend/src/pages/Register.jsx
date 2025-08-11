import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.username, form.email, form.password);
      alert('Registration successful');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2 border rounded" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
