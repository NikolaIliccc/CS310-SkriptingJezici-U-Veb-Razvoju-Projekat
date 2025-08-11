import React, { createContext, useContext, useState, useEffect } from "react";
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pokušamo dohvatiti trenutnog korisnika na mount:
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // pokušaj bez localStorage prvo (cookie-based auth)
        const res = await axios.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        // fallback: ako imamo token u localStorage, pošalji Authorization header
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try {
            const res2 = await axios.get('/auth/me');
            setUser(res2.data);
          } catch (err2) {
            console.error('Ne mogu dohvatiti user-a ni sa tokenom:', err2);
            setUser(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (username, email, password) => {
    const res = await axios.post('/auth/register', { username, email, password });
    // server postavlja cookie, ali vraća i token i user u body
    const token = res.data.token;
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setUser(res.data.user);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    const token = res.data.token;
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
