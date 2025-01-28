import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slStore/authSlice';
import { cartReducer } from './slStore/cartSlice';
import { categoryReducer } from './slStore/categorySlice';
import { productReducer } from './slStore/productSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    categories: categoryReducer,
    products: productReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export { store };