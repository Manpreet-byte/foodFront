import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Load initial state from localStorage
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('cart');
    const savedItems = localStorage.getItem('savedForLater');
    const coupon = localStorage.getItem('appliedCoupon');
    return {
      items: saved ? JSON.parse(saved) : [],
      savedItems: savedItems ? JSON.parse(savedItems) : [],
      appliedCoupon: coupon ? JSON.parse(coupon) : null
    };
  } catch {
    return { items: [], savedItems: [], appliedCoupon: null };
  }
};

const initialState = loadFromStorage();

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      } else {
        return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
      }
    }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload.id
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        )
      };
    
    case 'UPDATE_ITEM_NOTES':
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload.id
            ? { ...i, notes: action.payload.notes }
            : i
        )
      };
    
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    
    case 'CLEAR_CART':
      return { ...state, items: [], appliedCoupon: null };
    
    case 'SAVE_FOR_LATER': {
      const item = state.items.find(i => i._id === action.payload._id);
      if (!item) return state;
      return {
        ...state,
        items: state.items.filter(i => i._id !== action.payload._id),
        savedItems: [...state.savedItems.filter(i => i._id !== action.payload._id), { ...item, quantity: 1 }]
      };
    }
    
    case 'MOVE_TO_CART': {
      const item = state.savedItems.find(i => i._id === action.payload._id);
      if (!item) return state;
      const existingInCart = state.items.find(i => i._id === action.payload._id);
      return {
        ...state,
        savedItems: state.savedItems.filter(i => i._id !== action.payload._id),
        items: existingInCart 
          ? state.items.map(i => i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...state.items, { ...item, quantity: 1 }]
      };
    }
    
    case 'REMOVE_SAVED_ITEM':
      return { ...state, savedItems: state.savedItems.filter(i => i._id !== action.payload) };
    
    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload };
    
    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null };
    
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
    localStorage.setItem('savedForLater', JSON.stringify(state.savedItems));
    if (state.appliedCoupon) {
      localStorage.setItem('appliedCoupon', JSON.stringify(state.appliedCoupon));
    } else {
      localStorage.removeItem('appliedCoupon');
    }
  }, [state.items, state.savedItems, state.appliedCoupon]);

  const addToCart = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const updateItemNotes = (id, notes) => dispatch({ type: 'UPDATE_ITEM_NOTES', payload: { id, notes } });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const saveForLater = (item) => dispatch({ type: 'SAVE_FOR_LATER', payload: item });
  const moveToCart = (item) => dispatch({ type: 'MOVE_TO_CART', payload: item });
  const removeSavedItem = (id) => dispatch({ type: 'REMOVE_SAVED_ITEM', payload: id });
  const applyCoupon = (coupon) => dispatch({ type: 'APPLY_COUPON', payload: coupon });
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });

  // Calculate totals
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = state.appliedCoupon ? (subtotal * state.appliedCoupon.discount / 100) : 0;
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal - discount + deliveryFee;
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart: state, 
      addToCart, 
      updateQuantity, 
      updateItemNotes,
      removeFromCart, 
      clearCart,
      saveForLater,
      moveToCart,
      removeSavedItem,
      savedItems: state.savedItems,
      appliedCoupon: state.appliedCoupon,
      applyCoupon,
      removeCoupon,
      subtotal,
      discount,
      deliveryFee,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
