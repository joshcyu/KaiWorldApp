import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [exitAnim, setExitAnim] = useState(false);

  // Function to handle navigation with exit animation
  const handleNavigate = (path) => {
    setExitAnim(true);
    // Wait for the exit animation to finish (e.g., 0.5s) then navigate
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={exitAnim ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Shapes */}
      <motion.div 
        className="absolute top-0 left-0 w-40 h-40 bg-white opacity-20 rounded-full filter blur-2xl"
        animate={{ x: [0, 200, 0], y: [0, 100, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-56 h-56 bg-yellow-300 opacity-20 rounded-full filter blur-3xl"
        animate={{ x: [0, -200, 0], y: [0, -150, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Animated Headline */}
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Kai Mall Kai World!
        </motion.h1>

        {/* Animated Subheading */}
        <motion.p
          className="mt-4 text-xl sm:text-2xl md:text-3xl text-white max-w-md mx-auto drop-shadow-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Claim Coins • Redeem Rewards • Experience the Magic
        </motion.p>

        {/* Animated Buttons */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.button
            onClick={() => handleNavigate('/auth')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-purple-700 font-bold rounded-full shadow-lg transition-all"
          >
            Get Started
          </motion.button>
          <motion.button
            onClick={() => handleNavigate('/auth')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border-2 border-white text-white font-bold rounded-full shadow-lg transition-all bg-transparent"
          >
            Login
          </motion.button>
        </motion.div>

        {/* Animated Rotating Logo (3D-like) */}
        <motion.div
          className="mt-12"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <img
            src="KAIMALL LOGO.png"
            alt="Kai Mall Logo"
            className="w-24 h-auto sm:w-32 md:w-40"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
