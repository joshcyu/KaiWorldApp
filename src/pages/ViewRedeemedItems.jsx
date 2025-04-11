import React, { useEffect, useState } from 'react';
import api from '../api';
import RedeemedItemCard from '../components/RedeemedItemCard';

const ViewRedeemedItems = () => {
  const [redeemedItems, setRedeemedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchRedeemedItems = async () => {
      try {
        const res = await api.get(`/reward/redeemedCoins/${user.UserId}`);
        setRedeemedItems(res.data);
      } catch (error) {
        console.error("Error fetching redeemed items:", error);
      }
    };

    fetchRedeemedItems();
  }, [user.UserId]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-violet-500 via-pink-400 to-yellow-300 p-6">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Your Redeemed Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {redeemedItems.map(item => (
          <div key={item.GC_Code} className="cursor-pointer" onClick={() => setSelectedItem(item)}>
            <RedeemedItemCard
              gcCode={item.GC_Code}
              name={item.Name}
              itemName={item.ItemName}
              date={item.Date}
            />
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-semibold text-center mb-6">Item Details</h3>
            <RedeemedItemCard
              gcCode={selectedItem.GC_Code}
              name={selectedItem.Name}
              itemName={selectedItem.ItemName}
              date={selectedItem.Date}
            />
            <button
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              onClick={() => setSelectedItem(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRedeemedItems;
