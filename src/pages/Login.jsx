import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';


export default function Login() {
  localStorage.removeItem('user')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // Success state
  const [showError, setShowError] = useState(false); // Error state
  const [errorMessage, setErrorMessage] = useState(''); // Error message
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Show success overlay
      setShowSuccess(true);

      // Navigate to claim after a delay
      setTimeout(() => {
        navigate('/claim');
      }, 2000); // Wait for the animation to complete

    } catch (err) {
      // Show error overlay
      setErrorMessage(err.response?.data?.message || 'Login failed');
      setShowError(true);

      // Hide error overlay after 3 seconds
      setTimeout(() => setShowError(false), 3000);
  
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 animate-gradient">
      
      {/* Animated blobs */}
      <div className="absolute w-72 h-72 bg-white opacity-20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-300 opacity-20 rounded-full mix-blend-overlay filter blur-3xl animate-ping bottom-10 right-10"></div>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-20">
          <div className="bg-white p-8 rounded-xl text-center shadow-xl animate-fade-in">
            <h2 className="text-2xl font-semibold text-purple-600">Login Successful!</h2>
            <p className="mt-2 text-gray-700">Redirecting...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {showError && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-20">
          <div className="bg-red-500 p-8 rounded-xl text-center shadow-xl animate-fade-in">
            <h2 className="text-2xl font-semibold text-white">Error</h2>
            <p className="mt-2 text-white">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Container for Desktop and Mobile View */}
      <div className="flex h-full items-center justify-center">
        {/* Left Side Tutorial (visible only on desktop) */}
        <div className="hidden lg:block w-1/2 p-8 bg-white shadow-xl rounded-3xl mx-4 mr-20">
          <h3 className="text-xl text-center font-bold text-purple-700 mb-4">To Claim Your Reward, You Can Log In Here Or </h3>
           <h3 className="text-xl text-center font-bold text-purple-700 mb-4">  Use Your Phone And Follow This Steps:</h3>
          <ul className="list-decimal pl-6 text-gray-800 space-y-4">
            <li>Connect to the 'Kai Mall Free WiFi'</li>
            <li>Scan the QR Code below (redirecting to our local web)</li>
            <div className="">
              <img src="unnamed.png" alt="QR Code" className="w-32 rounded-md shadow-lg" />
            </div>
            <li>Log-in (Create an account if you don't have one yet)</li>
          </ul>
 
        </div>

        {/* Right Side Login Form */}
        <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-sm text-center">
          <h2 className="text-3xl font-bold mb-4 text-purple-700">Kai Mall Login</h2>

          <input
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <input
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 rounded-xl hover:scale-105 transition-transform"
          >
            Login
          </button>

          <p className="mt-4 text-gray-700">Don't have an account?</p>
          <Link to="/register">
            <button className="mt-2 w-full bg-white border-2 border-purple-500 text-purple-700 font-semibold py-2 rounded-xl hover:bg-purple-100 transition">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
