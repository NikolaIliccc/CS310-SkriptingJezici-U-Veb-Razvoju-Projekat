import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Games from './pages/Games';
import GameDetails from './pages/GameDetails';
import AdminPanel from './pages/AdminPanel';

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
      <Route path="/games/:id" element={<ProtectedRoute><GameDetails /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
    </Routes>
  </>
);

export default App;
