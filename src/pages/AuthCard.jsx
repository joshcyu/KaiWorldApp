// src/pages/AuthCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaUserPlus } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import { GiBearFace } from 'react-icons/gi';
import '../assets/authcard.css'; // Ensure your flip card CSS is updated with custom styles

export default function AuthCard() {
  // cardStep:
  // 0 = initial "Click Me" card,
  // 1 = greeting message,
  // 2 = date suggestion with interactive buttons,
  // 3 = final love message.
  const [cardStep, setCardStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Remove any stored user data when component mounts.
    localStorage.removeItem('user');
  }, []);

  const handleNext = () => {
    setCardStep((prev) => prev + 1);
  };

  const handleSureSure = () => {
    setCardStep(3);
  };

  // For the "No No" button, prevent click with a playful shake effect.
  const handleNoNo = (e) => {
    e.preventDefault();
    // Optionally add a shake effect using Framer Motion controls or CSS animation.
    alert("Bawal tumanggi. Date us!!!!");
  };

  // Variants for the card flip animation.
  const cardVariants = {
    initial: { rotateY: 180, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -180, opacity: 0 }
  };

  // Floating hearts as a background effect.
  const FloatingHearts = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="text-pink-300 text-3xl"
          initial={{ opacity: 0, y: 0, x: `${Math.random() * 100}%` }}
          animate={{
            opacity: 1,
            y: "-100vh",
            rotate: [0, 360]
          }}
          transition={{
            duration: 12 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-4 overflow-hidden">
      <FloatingHearts />
      <AnimatePresence exitBeforeEnter>
        {cardStep === 0 && (
          <motion.div
            key="step0"
            className="auth-card p-8 bg-white bg-opacity-90 rounded-3xl shadow-2xl ring-4 ring-pink-200"
            initial={cardVariants.initial}
            animate={cardVariants.animate}
            exit={cardVariants.exit}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
              Hi, Pearl Grace na napakaganda!!!
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center">
              I just want to say sorry, sorry because I've been busy. I was not able to consider 'yung mararamdaman mo but let me bawi!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg"
            >
              Click Me!
            </motion.button>
          </motion.div>
        )}

        {cardStep === 1 && (
          <motion.div
            key="step1"
            className="auth-card p-8 bg-white bg-opacity-90 rounded-3xl shadow-2xl ring-4 ring-red-200"
            initial={cardVariants.initial}
            animate={cardVariants.animate}
            exit={cardVariants.exit}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-extrabold text-red-500 mb-4 text-center drop-shadow-md">
              I just want you to know na you're literally on my mind every single minute!
            </h2>
            <div className="flex justify-center items-center mb-6 gap-4">
              <FaHeart className="text-6xl text-pink-500 animate-bounce" />
              <GiBearFace className="text-6xl text-amber-700 animate-wiggle" />
            </div>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Even when I'm doing something, you're actually always on mind na sinasama ko pangalan mo sa lhat ng gnagawa ko, like literally. I'm going insane when you're not talking to me.
              I miss you soo soo much. I want to go to you now.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg"
            >
              Next
            </motion.button>
          </motion.div>
        )}

        {cardStep === 2 && (
          <motion.div
            key="step2"
            className="auth-card p-8 bg-white bg-opacity-90 rounded-3xl shadow-2xl ring-4 ring-blue-200"
            initial={cardVariants.initial}
            animate={cardVariants.animate}
            exit={cardVariants.exit}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-blue-500 mb-4 text-center">
              Let's Date this Friday!
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Before anything else. I want to formally invite you para sa isang date this coming Friday. I'm expecting for your lovely presence.
            </p>
            <div className="flex justify-around">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSureSure}
                className="py-2 px-4 bg-green-500 text-white rounded-xl shadow-lg"
              >
                Sure Sure
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 1.1 }}
                onClick={handleNoNo}
                className="py-2 px-4 bg-red-500 text-white rounded-xl shadow-lg"
              >
                No No
              </motion.button>
            </div>
          </motion.div>
        )}

        {cardStep === 3 && (
          <motion.div
            key="step3"
            className="auth-card p-8 bg-white bg-opacity-90 rounded-3xl shadow-2xl ring-4 ring-purple-200"
            initial={cardVariants.initial}
            animate={cardVariants.animate}
            exit={cardVariants.exit}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-extrabold text-purple-700 mb-4 text-center">
              P.S. I Love You!
            </h2>
            <p className="text-lg text-gray-700 text-center">
              I love you soo soo much, for realll. I think it's pretty obvious naman, or is it, I don't really know, but you told me that it is. 
              Pero ayun I just want you to know na you're really important sa'kin, and I just can't afford to lose you. 

              Am I gonna lose you. I hope not. I really hope not.

              
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
