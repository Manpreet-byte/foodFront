import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      } else {
        return { items: [...state.items, { ...action.payload, quantity: 1 }] };
      }
    
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map(i =>
          i._id === action.payload.id
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        )
      };
    
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i._id !== action.payload) };
    
    case 'CLEAR_CART':
      return { items: [] };
    
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addToCart = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ cart: state, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
