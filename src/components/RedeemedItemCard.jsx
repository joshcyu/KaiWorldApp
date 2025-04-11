import React from 'react';

const RedeemedItemCard = ({ gcCode, name, itemName, date }) => {
  return (
    <div className="bg-white shadow-xl rounded-xl p-6 max-w-xs mx-auto my-4 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-t-xl p-3 text-center">
        <h3 className="text-xl font-semibold">Redeemed Item</h3>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="font-semibold text-lg">GC Code:</span>
          <p className="text-purple-700">{gcCode}</p>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-lg">Name:</span>
          <p>{name}</p>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-lg">Item:</span>
          <p>{itemName}</p>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-lg">Date:</span>
          <p>{new Date(date).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default RedeemedItemCard;
