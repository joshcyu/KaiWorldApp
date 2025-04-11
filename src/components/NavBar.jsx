import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCoins, FaHome, FaAward } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null); // User state fetched from API
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.UserId;

  // Fetch user details on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/details?userId=${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  // If user is not loaded yet, show a minimal loading header
  if (!user) {
    return (
      <div className="flex items-center justify-center h-16 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white">
        Loading user...
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="relative">
      {/* Desktop Navbar */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white shadow-lg rounded-b-2xl transition-all">
        <div className="flex items-center gap-3">
          <FaHome className="text-2xl" />
          <span className="text-xl font-bold">Kai Mall</span>
        </div>
        <div className="flex items-center gap-6 text-lg">
          <div className="flex items-center gap-1">
            <FaCoins className="text-yellow-300 animate-bounce" />
            <span className="font-semibold text-xl">{user.CoinsEarned}</span>
          </div>
          <Link to="/claim" className="flex items-center gap-1 hover:text-yellow-300 transition">
            <FaCoins className="text-lg" />
            <span>Claim Coins</span>
          </Link>
          <Link to="/food" className="flex items-center gap-1 hover:text-yellow-300 transition">
            <FaAward className="text-lg" />
            <span>View Redeemables</span>
          </Link>
          <Link to="/view-redeemed-items" className="flex items-center gap-1 hover:text-yellow-300 transition">
            <FaAward className="text-lg" />
            <span>View Vouchers</span>
          </Link>   
          <Link to="/tier-progress" className="flex items-center gap-1 hover:text-yellow-300 transition">
            <FaAward className="text-lg" />
            <span>View Tier</span>
          </Link> 
          <Link to="/scan-claim" className="flex items-center gap-1 hover:text-yellow-300 transition">
            <FaAward className="text-lg" />
            <span>Scan QR</span>
          </Link> 
          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-white/20 transition-all"
            title="Logout"
          >
            <FiLogOut className="text-2xl" />
          </button>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white shadow-md">
          <div className='flex gap-2 items-center'>
            <FaHome className="text-xl" />
            <span className="text-lg font-bold">Hi {user.Name}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <FaCoins className="text-yellow-300 animate-bounce" />
            <span className="text-lg font-bold"> Coins: {user.CoinsEarned}</span>
          </div>
        <button
          onClick={toggleSidebar}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition duration-300"
        >
          {isSidebarOpen ? <AiOutlineClose className="text-3xl text-white" /> : <AiOutlineMenu className="text-3xl text-white" />}
        </button>
      </header>

      {/* Mobile Sidebar (Overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Clickable overlay to close the sidebar */}
            <div className="absolute inset-0 bg-black/50" onClick={closeSidebar} />
            <motion.div
              className="absolute top-0 left-0 w-64 h-full bg-gradient-to-b from-purple-600 to-pink-500 text-white rounded-r-2xl shadow-lg p-6"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <FaHome className="text-2xl" />
                  <span className="text-xl font-bold">Kai Mall</span>
                </div>
                <button onClick={toggleSidebar}>
                  <AiOutlineClose className="text-2xl text-white" />
                </button>
              </div>
              <nav>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to="/claim"
                      onClick={closeSidebar}
                      className="flex items-center gap-3 py-2 px-4 rounded-lg text-xl font-semibold transition-all hover:bg-yellow-300 hover:text-black"
                    >
                      <FaCoins className="text-lg" />
                      Claim Coins
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food"
                      onClick={closeSidebar}
                      className="flex items-center gap-3 py-2 px-4 rounded-lg text-xl font-semibold transition-all hover:bg-yellow-300 hover:text-black"
                    >
                      <FaAward className="text-lg" />
                      View Redeemables
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/view-redeemed-items"
                      onClick={closeSidebar}
                      className="flex items-center gap-3 py-2 px-4 rounded-lg text-xl font-semibold transition-all hover:bg-yellow-300 hover:text-black"
                    >
                      <FaAward className="text-lg" />
                      View Vouchers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tier-progress"
                      onClick={closeSidebar}
                      className="flex items-center gap-3 py-2 px-4 rounded-lg text-xl font-semibold transition-all hover:bg-yellow-300 hover:text-black"
                    >
                      <FaAward className="text-lg" />
                      View Your Status
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/scan-claim"
                      onClick={closeSidebar}
                      className="flex items-center gap-3 py-2 px-4 rounded-lg text-xl font-semibold transition-all hover:bg-yellow-300 hover:text-black"
                    >
                      <FaAward className="text-lg" />
                      Scan QR
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        closeSidebar();
                        logout();
                      }}
                      className="w-full flex items-center gap-3 py-2 px-4 rounded-lg text-xl font-semibold transition-all hover:bg-red-400 hover:text-black"
                    >
                      <FiLogOut className="text-2xl" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
