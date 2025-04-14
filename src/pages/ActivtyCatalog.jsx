import { useEffect, useState } from 'react';
import api1 from '../api1';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


// Default food image placeholder (adjust the URL if needed)
const defaultFoodImage = 'placeholder.jpeg';

const ActivityCatalog = () => {
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [menus, setMenus] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [outletId, setOutletId] = useState('');
  const [coins, setCoins] = useState(0);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.UserId; 
  const [quantities, setQuantities] = useState({}); // keys: menu.Item_Id, value: quantity
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const navigate = useNavigate();


  // Fetch user's coin details
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await api.get(`/user/details?userId=${userId}`);
        setCoins(res.data.CoinsEarned);
      } catch (err) {
        console.error('Error fetching coins:', err);
      }
    };
    if (userId) fetchCoins();
  }, [userId]);

  // Fetch outlets when the component mounts
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await api1.get('/catalog/getActivityOutlets');
        setOutlets(response.data);
      } catch (err) {
        console.error('Error fetching outlets:', err);
      }
    };
    fetchOutlets();
  }, []);

  // When outletId changes, update selected outlet
  useEffect(() => {
    if (outletId) setSelectedOutlet(outletId);
  }, [outletId]);

  // Fetch food menus when the selected outlet changes
  useEffect(() => {
    if (selectedOutlet) {
      const fetchMenus = async () => {
        try {
          const response = await api1.get(`/catalog/getFoodMenus?outletId=${selectedOutlet}`);
          setMenus(response.data);
        } catch (err) {
          console.error('Error fetching food menus:', err);
        }
      };
      fetchMenus();
    }
  }, [selectedOutlet]);

  // Handle quantity update using plus/minus buttons
  const incrementQuantity = (menuId) => {
    setQuantities((prev) => ({
      ...prev,
      [menuId]: (prev[menuId] || 1) + 1,
    }));
  };

  const decrementQuantity = (menuId) => {
    setQuantities((prev) => ({
      ...prev,
      [menuId]: Math.max((prev[menuId] || 1) - 1, 1),
    }));
  };

  // Handle redemption for a specific menu item with the selected quantity
  const handleRedeem = async (item) => {
    const quantity = quantities[item.Item_Id] || 1;
    // Calculate coins per unit = ceil(price/100)*100
    const coinsPerUnit = Math.ceil(item.Price / 100) * 100;
    const totalCoinsRequired = coinsPerUnit * quantity;

    if (coins < totalCoinsRequired) {
      setModalMessage(`Insufficient coins. You need ${totalCoinsRequired} coins to redeem ${quantity} unit(s), but you have only ${coins}.`);
      setClaimSuccess(false);
      setShowModal(true);
      return;
    }

    try {
      // Call redeem API, passing quantity along with other details.
      const redeemRes = await api.post('/reward/redeem', {
        userId: userId,
        itemName: item.Item_Name,
        price: item.Price,
        quantity: quantity, // sending quantity
        customerNo: storedUser.CustomerNo,
      });
      setModalMessage(redeemRes.data.message);
      setClaimSuccess(true);
      // Assume backend returns receipt details in redeemRes.data.receipt (last redeemed record)
      setReceipt(redeemRes.data.receipt);
      setShowModal(true);

      // After 3 seconds, reload to update coins
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error(err);
      setModalMessage('Redemption failed. Please try again.');
      setClaimSuccess(false);
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 py-8">
      <div className="px-4">
        <h2 className="text-4xl font-bold text-center text-purple-800 mb-8">Select Desired Activity</h2>

        {/* Outlet Selection as Button Group */}
        <div className="mb-10">
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {outlets.length > 0 ? (
              outlets.map((outlet) => (
                <button
                  key={outlet.OutletId}
                  onClick={() => setSelectedOutlet(outlet.OutletId)}
                  className={`flex-shrink-0 px-6 py-3 rounded-full border-2 transition-all duration-300 
                    ${selectedOutlet === outlet.OutletId 
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xl'
                      : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-100'
                    }`}
                >
                  {outlet.Outlets}
                </button>
              ))
            ) : (
              <p className="text-lg text-gray-600">Loading outlets...</p>
            )}
          </div>
        </div>

        {/* Food Menu */}
        {selectedOutlet && (
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold text-center text-purple-800 mb-8">Claim Activity Voucher</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-center">
              {menus.length > 0 ? (
                menus.map((menu) => (
                  <div
                    key={menu.Item_Id}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 rounded-lg shadow-2xl hover:scale-105 transform transition duration-300 min-h-[400px] w-72 flex flex-col justify-between"
                  >
                    <img
                      src={menu.Photo_Link || defaultFoodImage}
                      alt={menu.Item_Name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-2">{menu.Item_Name}</h3>
                      <div className='flex justify-center items-center'>
                        <p className="text-xl text-white mb-4">Coins Needed: {((menu.Price <= 100) ? 100 : (menu.Price >= 101 && menu.Price <=200) ? 200 : 0 )}</p>
                        <FaCoins className="text-yellow-300 ml-1 mb-4" />
                      </div>
                    </div>
                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => decrementQuantity(menu.Item_Id)}
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition"
                      >
                        −
                      </button>
                      <span className="text-white font-semibold">{quantities[menu.Item_Id] || 1}</span>
                      <button
                        onClick={() => incrementQuantity(menu.Item_Id)}
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRedeem(menu)}
                      className="w-full py-2 bg-yellow-500 text-purple-800 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition duration-300"
                    >
                      Redeem
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-2xl text-gray-600 col-span-full">
                  No menus available for this outlet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay for Redemption Prompts */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 shadow-xl text-center relative max-w-sm w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-purple-700">
                {claimSuccess ? '🎉 Redemption Successful!' : '⚠️ Error'}
              </h3>
              <p className="mb-4 text-gray-800">{modalMessage}</p>
              {claimSuccess && receipt ? (
                <div className="text-left mb-4">
                  <p className="mb-2"><strong>GC Code:</strong> {receipt.GC_Code}</p>
                  <p className="mb-2"><strong>Name:</strong> {receipt.Name}</p>
                  <p className="mb-2"><strong>Item:</strong> {receipt.ItemName}</p>
                  <p className="mb-2"><strong>Date:</strong> {new Date(receipt.Date).toLocaleString()}</p>
                </div>
              ) : null}
              <div className="mt-6 flex justify-around">
                {claimSuccess && (
                  <button
                    onClick={() => navigate('/view-redeemed-items')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    View Vouchers
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityCatalog;
