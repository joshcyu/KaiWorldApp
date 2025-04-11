import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCoins } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { Howl } from 'howler';
import congratulationsSound from '../assets/rank-up-sound.mp3';

export default function UserTierModal({ userPoints, closeModal }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);

  const tier = userPoints >= 1500 ? 'Gold' : userPoints >= 500 ? 'Silver' : null;

  useEffect(() => {
    if (tier && !soundPlayed) {
      const sound = new Howl({
        src: [congratulationsSound],
        volume: 1,
        onend: () => setSoundPlayed(true),
      });
      sound.play();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
    }
  }, [tier, soundPlayed]);

  const handleClose = () => {
    setShowConfetti(false);
    closeModal();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-6 shadow-xl text-center relative max-w-md w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        {tier && (
          <>
            <motion.h3
              className="text-3xl font-bold text-purple-700 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              🎉 Congratulations! You've reached {tier} Tier!
            </motion.h3>
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FaCoins className="text-6xl text-yellow-500" />
            </motion.div>
            <p className="text-xl text-gray-700 mb-4">
              You’ve earned {userPoints} UserPoints! Keep up the great work!
            </p>
          </>
        )}

        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

        <motion.button
          onClick={handleClose}
          className="mt-6 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
