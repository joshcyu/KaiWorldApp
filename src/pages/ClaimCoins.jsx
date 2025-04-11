import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { FaCoins } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import FoodTabs from './FoodTabs'; // Import the FoodTabs component
import api1 from '../api1';
import { motion, AnimatePresence } from 'framer-motion';
import UserTierModal from '../components/UserTierModal'; // Import tier modal if needed
import { QRCodeCanvas } from 'qrcode.react';

export default function ClaimCoins() {
  const [terminalId, setTerminalId] = useState('');
  const [posNo, setPosNo] = useState('');
  const [coins, setCoins] = useState(0);
  const [outlets, setOutlets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [showTierModal, setShowTierModal] = useState(false);
  const [congratsSilver, setCongratsSilver] = useState(null);
  const [congratsGold, setCongratsGold] = useState(null);
  const [showQR, setShowQR] = useState(false); // Controls QR Code modal

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.UserId;
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  // If user is not logged in, redirect to auth page
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) navigate('/auth');
  }, [navigate]);

  // Fetch user points and congrats flags
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await api.get(`/user/details?userId=${userId}`);
        setUserPoints(res.data.UserPoints);
        setCongratsSilver(res.data.isCongratulatedSilver);
        setCongratsGold(res.data.isCongratulatedGold);
      } catch (err) {
        console.error('Error fetching coins:', err);
      }
    };
    if (userId) fetchCoins();
  }, [userId]);

  // Fetch outlets
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const res = await api1.get('/food/getOutlets');
        setOutlets(res.data);
      } catch (err) {
        console.error('Error fetching outlets:', err);
      }
    };
    fetchOutlets();
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logout, 2000000);
  };

  useEffect(() => {
    resetTimer();
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (user?.CoinsEarned) {
      setCoins(user.CoinsEarned);
    }
  }, [user]);

  // Instead of immediately claiming, show the QR code modal
  const handleClaim = () => {
    if (isClaiming) return;
    if (!terminalId || !posNo) {
      setModalMessage('Terminal and SI No are required.');
      setClaimSuccess(false);
      setShowModal(true);
      return;
    }
    // Show the QR Code modal
    setShowQR(true);
  };

  // Polling for claim status once the QR code modal is closed and claim is pending
  useEffect(() => {
    let interval;
    if (!showQR && !isClaiming && terminalId && posNo) {
      // Poll every 3 seconds
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/reward/claimStatus?terminalId=${terminalId}&posNo=${posNo}`);
          if (res.data.claimed) {
            setModalMessage('Claim confirmed! You have earned Kai Coins.');
            setClaimSuccess(true);
            setShowModal(true);
            clearInterval(interval);
            setTimeout(() => window.location.reload(), 3000);
          }
        } catch (err) {
          console.error('Error checking claim status:', err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [showQR, terminalId, posNo, isClaiming]);

  // Confirm claim after supervisor scans the QR code
  const confirmClaim = async () => {
    setIsClaiming(true);
    try {
      const res = await api.post('/reward/claim', {
        terminalId,
        posNo,
        userId,
      });
      setModalMessage(res.data.message);
      setClaimSuccess(res.data.message.includes('Kai Coins'));
      setShowModal(true);
      setShowQR(false);
      if (res.data.message.includes('Kai Coins')) {
        setTimeout(() => window.location.reload(), 3000);
      } else {
        setIsClaiming(false);
      }
    } catch (err) {
      setModalMessage('Claim failed');
      setClaimSuccess(false);
      setShowModal(true);
      setIsClaiming(false);
    }
  };

  // QR code data: you might wish to include a token or encrypted details in production
  const qrValue = JSON.stringify({ terminalId, posNo, userId });

  // Update tier status if thresholds are reached.
  const updateCongratulatedStatus = async (isCongratulatedSilver, isCongratulatedGold) => {
    try {
      await api.post('/reward/updateCongratulationStatus', {
        userId,
        isCongratulatedSilver,
        isCongratulatedGold,
      });
    } catch (err) {
      console.error('Error updating congratulation status:', err);
    }
  };

  useEffect(() => {
    if (userPoints >= 500 && userPoints < 1500 && congratsSilver === false) {
      setShowTierModal(true);
      updateCongratulatedStatus(true, false);
    } else if (userPoints >= 1500 && congratsGold === false) {
      setShowTierModal(true);
      updateCongratulatedStatus(true, true);
    }
    console.log(userPoints);
  }, [userPoints, congratsSilver, congratsGold]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-violet-500 via-pink-500 to-yellow-300 text-gray-900">
      <main className="flex flex-col justify-center items-center px-4 py-10">
        <div className="w-full max-w-md bg-white/30 backdrop-blur-lg border border-white/40 p-8 rounded-2xl shadow-2xl mt-8">
          <h2 className="text-2xl font-bold text-center text-purple-100 mb-6">
            Claim Your Kai Coins 🪙
          </h2>

          {/* Terminal Selection */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-white">Terminal</label>
            <select
              onChange={e => setTerminalId(e.target.value)}
              value={terminalId}
              className="w-full p-2 rounded-lg border text-white border-white/40 bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            >
              <option value="">Select Terminal</option>
              {Array.from({ length: 25 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{`Terminal ${i + 1}`}</option>
              ))}
            </select>
          </div>

          {/* SI Number */}
          <div className="mb-6">
            <label className="block mb-1 font-medium text-white">SI No</label>
            <input
              placeholder="Enter SI No"
              onChange={e => setPosNo(e.target.value)}
              value={posNo}
              className="w-full text-white p-2 rounded-lg border border-white/40 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>

          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className={`w-full py-2 rounded-xl font-semibold transition-transform ${
              isClaiming
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:scale-105'
            }`}
          >
            {isClaiming ? 'Claiming...' : 'Claim Coins'}
          </button>
        </div>
      </main>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-xl text-center relative max-w-xs w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-4 text-purple-100">
                Scan this QR Code with a Supervisor
              </h3>
              <div className="mx-auto mb-4">
                <QRCodeCanvas value={qrValue} size={150} bgColor="#ffffff" fgColor="#000000" level="H" />
              </div>
              <p className="mb-4 text-gray-700">
                Once scanned, the claim will be processed automatically.
              </p>
              <button
                onClick={confirmClaim}
                className="w-full py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:scale-105 transition-transform"
              >
                Confirm Claim
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claim Result Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/40 backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-xl text-center relative max-w-sm w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-4 text-purple-700">
                {claimSuccess ? '🎉 Success!' : '⚠️ Notice'}
              </h3>
              <p className="mb-4 text-white">{modalMessage}</p>
    
              {claimSuccess && (
                <motion.div
                  className="flex justify-center space-x-2 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="text-yellow-500 text-3xl"
                      initial={{ y: -20 }}
                      animate={{ y: [0, -20, 0] }}
                      transition={{ repeat: Infinity, delay: i * 0.2, duration: 1 }}
                    >
                      <FaCoins />
                    </motion.div>
                  ))}
                </motion.div>
              )}
    
              {!claimSuccess && (
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                >
                  Close
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    
      {/* Tier Modal */}
      <AnimatePresence>
        {showTierModal && (
          <UserTierModal 
            userPoints={userPoints} 
            closeModal={() => setShowTierModal(false)} 
          />
        )}
      </AnimatePresence>
    
    </div>
  );
}
