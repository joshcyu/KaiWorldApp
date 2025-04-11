import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { FaUserPlus } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import '../assets/authcard.css'; // We'll add flip animation here
import { useEffect } from 'react';

export default function AuthCard() {
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', username: '', password: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('user'); // remove stored user data
  }, []);

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', loginData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setShowSuccess(true);
      setTimeout(() => navigate('/claim'), 2000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Login failed');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', registerData);
      alert('Registration successful!');
      setIsFlipped(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500">
      {showSuccess && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-20">
          <div className="bg-white p-8 rounded-xl text-center shadow-xl">
            <h2 className="text-2xl font-semibold text-purple-600">Login Successful!</h2>
            <p className="mt-2 text-gray-700">Redirecting...</p>
          </div>
        </div>
      )}
      {showError && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-20">
          <div className="bg-red-500 p-8 rounded-xl text-center shadow-xl">
            <h2 className="text-2xl font-semibold text-white">Error</h2>
            <p className="mt-2 text-white">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="auth-card-container">
        <div className={`auth-card ${isFlipped ? 'flipped' : ''}`}>
          {/* Front (Login) */}
          <div className="auth-card-face auth-card-front">
            <h2 className="text-3xl font-bold text-purple-700 mb-6">Kai Mall Login</h2>
            <input
              placeholder="Username"
              value={loginData.username}
              onChange={e => setLoginData({ ...loginData, username: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300"
            />
            <input
              placeholder="Password"
              type="password"
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-xl mb-4"
            >
              Login
            </button>
            <p className="text-gray-700">Don't have an account?</p>
            <button
              onClick={() => setIsFlipped(true)}
              className="mt-2 w-full bg-white border-2 border-purple-500 text-purple-700 py-2 rounded-xl"
            >
              Create Account
            </button>
          </div>

          {/* Back (Register) */}
          <div className="auth-card-face auth-card-back">
            <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center justify-center gap-2">
              <FaUserPlus /> Register
            </h2>
            <input
              placeholder="Full Name"
              value={registerData.name}
              onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300"
            />
            <input
              placeholder="Username"
              value={registerData.username}
              onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300"
            />
            <input
              placeholder="Password"
              type="password"
              value={registerData.password}
              onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300"
            />
            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-xl mb-4"
            >
              Register
            </button>
            <p className="text-gray-700">Already have an account?</p>
            <button
            onClick={() => setIsFlipped(false)}
            className="flex items-center m-10 justify-center gap-2 text-lg text-purple-700 hover:underline hover:text-purple-900 transition"
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
