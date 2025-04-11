import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti'; // Import confetti effect
import api from '../api'; // adjust if needed

// Sound effect import
import rankUpSound from '../assets/rank-up-sound.mp3'; // Assuming you have this audio file

const TierProgress = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTier, setNewTier] = useState(false); // Track rank-up event for sound & confetti

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.UserId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/details?userId=${userId}`);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const getProgress = (points) => {
    if (points >= 1500) return 100;
    if (points >= 500) return ((points - 500) / 1000) * 100;
    return (points / 500) * 100;
  };

  const getNextTier = (points) => {
    if (points >= 1500) return '👑 You’ve reached the GOLD Tier! Glory!';
    if (points >= 500) return `🌟 Progress to GOLD Tier!`;
    return `💪 Progress to SILVER Tier!`;
  };

  const getTierColor = (points) => {
    if (points >= 1500) return 'text-yellow-500';
    if (points >= 500) return 'text-gray-400';
    return 'text-amber-600';
  };

  const getCoinGradient = (points) => {
    if (points >= 1500)
      return 'bg-gradient-to-tr from-yellow-300 via-yellow-500 to-yellow-600';
    if (points >= 500)
      return 'bg-gradient-to-tr from-gray-300 via-gray-400 to-gray-500';
    return 'bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-600';
  };

  const getCoinPulse = (points) => {
    if (points >= 1500) return 'animate-pulse-fast';
    if (points >= 500) return 'animate-pulse';
    return '';
  };

  const playRankUpSound = () => {
    const audio = new Audio(rankUpSound); // Play sound on rank-up
    audio.play();
  };

  const handleTierChange = (oldPoints, newPoints) => {
    if (oldPoints < 500 && newPoints >= 500) playRankUpSound(); // Silver Tier
    if (oldPoints < 1500 && newPoints >= 1500) playRankUpSound(); // Gold Tier
  };

  useEffect(() => {
    if (user) {
      const { UserPoints: oldPoints } = user;
      const progress = getProgress(oldPoints);
      const newPoints = user.UserPoints;

      if (oldPoints !== newPoints) {
        handleTierChange(oldPoints, newPoints); // Check if tier has changed
      }
    }
  }, [user]);

  if (loading) return <div className="text-center mt-10">Loading your progress...</div>;

  const { Name, UserPoints, UserTier, CoinsEarned } = user;
  const progress = getProgress(UserPoints);
  const tierColor = getTierColor(UserPoints);
  const coinGradient = getCoinGradient(UserPoints);
  const coinPulse = getCoinPulse(UserPoints);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-200 p-6">
      {UserPoints >= 1500 && <Confetti />} {/* Confetti animation on GOLD tier */}

      <h1 className="text-4xl font-extrabold text-yellow-800 mb-1">Welcome, {Name}!</h1>
      <p className={`text-lg font-semibold mb-4 ${tierColor}`}>Current Tier: {UserTier}</p>

      {/* 3D Coin with Color Animation */}
      <motion.div
        className={`relative rounded-full w-36 h-36 mb-6 flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-8 border-white ${coinGradient} ${coinPulse}`}
        animate={{ rotateY: [0, 360] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        style={{ perspective: 1000 }}
      >
        🪙
        <div className="absolute -bottom-10 w-full text-center text-yellow-700 font-semibold text-base">
          {UserPoints.toLocaleString()} Points
        </div>
      </motion.div>
      

      <div className="w-full max-w-md bg-gray-300 rounded-full h-6 overflow-hidden shadow-lg mb-4 mt-6">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2 }}
        />
      </div>

      <p className="text-md font-medium text-gray-700 mb-8">{getNextTier(UserPoints)}</p>

      {/* Progress Counter: */}
      <p className="text-lg font-medium text-yellow-600 mb-4">
        {UserPoints}/{UserPoints >= 1500 ? 1500 : UserPoints >= 500 ? 1500 : 500} to{' '}
        {UserPoints >= 1500 ? 'GOLD' : UserPoints >= 500 ? 'GOLD' : 'SILVER'}
      </p>

      <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-md border border-yellow-300 max-w-sm">
        <p className="text-xl font-semibold text-yellow-700 mb-2">💰 Coins Earned</p>
        <div className="text-3xl font-extrabold text-yellow-600">
          {CoinsEarned?.toLocaleString() || 0}
        </div>
      </div>
    </div>
  );
};

export default TierProgress;
