import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { FaUserPlus } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', form);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-purple-500 to-indigo-500 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-purple-700">
          <FaUserPlus /> Register
        </h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Name</label>
          <input
            placeholder="Enter your full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Username</label>
          <input
            placeholder="Choose a username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Password</label>
          <input
            placeholder="Create a password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-xl font-semibold hover:scale-105 transition-transform mb-4"
        >
          Register
        </button>

        {/* Redirect to Login */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 text-sm text-purple-700 hover:underline hover:text-purple-900 transition"
          >
            <MdLogin className="text-lg" />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
