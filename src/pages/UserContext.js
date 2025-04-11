import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize with default values, or load from an API / initial props
  const [user, setUser] = useState({
    UserId: null,
    Name: 'Guest',
    CoinsEarned: 0,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
