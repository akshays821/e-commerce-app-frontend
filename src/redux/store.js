import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import productReducer from "./slices/productsSlice.js";
import userAuthReducer from "./slices/userAuthSlice";
import uiReducer from "./slices/uiSlice";
import cartReducer from "./slices/cartSlice";

const rootReducer = combineReducers({
  products: productReducer,
  userAuth: userAuthReducer,
  ui: uiReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userAuth", "cart"], // persist auth and cart
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
