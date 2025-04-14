// src/pages/AuthCard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { FaUserPlus } from 'react-icons/fa';
import { MdLogin, MdInfoOutline } from 'react-icons/md';
import '../assets/authcard.css'; // Contains your flip animation styles
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', username: '', password: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  // When this component mounts, remove any stored user data.
  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', loginData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setModalMessage('Login Successful! Redirecting...');
      setShowSuccess(true);
      setTimeout(() => navigate('/claim'), 2000);
    } catch (err) {
      setModalMessage(err.response?.data?.message || 'Login failed');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', registerData);
      // Instead of an alert, show a success modal.
      setModalMessage('Registration Successful! Redirecting to login...');
      setShowSuccess(true);
      setTimeout(() => {
        setIsFlipped(false);
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      setModalMessage(err.response?.data?.message || 'Registration failed');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500">
      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-xl shadow-xl text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-2xl font-semibold text-purple-600">Success!</h2>
              <p className="mt-2 text-gray-700">{modalMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal Overlay */}
      <AnimatePresence>
        {showError && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-red-500 p-8 rounded-xl shadow-xl text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-2xl font-semibold text-white">Error</h2>
              <p className="mt-2 text-white">{modalMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flip Card Container */}
      <div className="auth-card-container">
        <div className={`auth-card ${isFlipped ? 'flipped' : ''}`}>
          {/* Front Face - Login */}
          <div className="auth-card-face auth-card-front">
            <h2 className="text-3xl font-bold text-purple-700 mb-6">Kai Mall Login</h2>
            <input
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <input
              placeholder="Password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-xl mb-4 hover:scale-105 transition-transform"
            >
              Login
            </button>
            <p className="text-gray-700">Don't have an account?</p>
            <button
              onClick={() => setIsFlipped(true)}
              className="mt-2 w-full bg-white border-2 border-purple-500 text-purple-700 py-2 rounded-xl hover:bg-purple-100 transition"
            >
              Create Account
            </button>
          </div>

          {/* Back Face - Register */}
          <div className="auth-card-face auth-card-back">
            <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center justify-center gap-2">
              <FaUserPlus /> Register
            </h2>
            <input
              placeholder="Full Name"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <input
              placeholder="Username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <input
              placeholder="Password"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-xl mb-4 hover:scale-105 transition-transform"
            >
              Register
            </button>
            <p className="text-gray-700">Already have an account?</p>
            <button
              onClick={() => setIsFlipped(false)}
              className="flex items-center justify-center gap-2 text-lg text-purple-700 hover:underline hover:text-purple-900 transition mt-4"
            >
              <MdLogin className="text-lg" />
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
