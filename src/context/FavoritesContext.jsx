import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (itemId) => {
    setFavorites((prev) => prev.includes(itemId) ? prev : [...prev, itemId]);
  };

  const removeFavorite = (itemId) => {
    setFavorites((prev) => prev.filter(id => id !== itemId));
  };

  const isFavorite = (itemId) => favorites.includes(itemId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
