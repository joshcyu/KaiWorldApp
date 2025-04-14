// src/FoodCatalog.jsx
import { useEffect, useState } from 'react';
import api1 from '../api1';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Default food image placeholder URL
const defaultFoodImage = 'placeholder.jpeg';

const FoodCatalog = () => {
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [menus, setMenus] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [outletId, setOutletId] = useState('');
  const navigate = useNavigate();

  // Fetch outlets when the component mounts
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await api1.get('/catalog/getFoodOutlets');
        setOutlets(response.data);
      } catch (err) {
        console.error('Error fetching outlets:', err);
      }
    };
    fetchOutlets();
  }, []);

  // When outletId changes, update selected outlet
  useEffect(() => {
    if (outletId) {
      setSelectedOutlet(outletId);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 py-8">
      <div className="px-4">
        <h2 className="text-4xl font-bold text-center text-purple-800 mb-8">
          Check Out Our Food Selections
        </h2>

        {/* Outlet Selection as a horizontal button group */}
        <div className="mb-10">
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {outlets.length > 0 ? (
              outlets.map((outlet) => (
                <button
                  key={outlet.OutletId}
                  onClick={() => setSelectedOutlet(outlet.OutletId)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-all duration-300
                    ${
                      selectedOutlet === outlet.OutletId
                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
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

        {/* Food Menu Grid */}
        {selectedOutlet && (
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold text-center text-purple-800 mb-8">Food Menus</h2>
            {/* Responsive Grid:
                  - For mobile: 2 columns,
                  - For small screens (sm): 2 columns,
                  - For medium (md): 3 columns,
                  - For large (lg): 4 columns,
                  - For extra-large (xl): 5 columns */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-center">
              {menus.length > 0 ? (
                menus.map((menu) => (
                  <motion.div
                    key={menu.Item_Id}
                    className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-lg flex flex-col justify-between"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={menu.Photo_Link || defaultFoodImage}
                      alt={menu.Item_Name}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-purple-800 mb-1">{menu.Item_Name}</h3>
                      <div className="flex items-center justify-center">
                        <p className="text-lg text-purple-700">Price: {menu.Price} Php</p>
                        <FaCoins className="text-yellow-500 ml-1" />
                      </div>
                    </div>
                  </motion.div>
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
    </div>
  );
};

export default FoodCatalog;
