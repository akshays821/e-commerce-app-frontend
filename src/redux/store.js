import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import productReducer from "./slices/productsSlice.js";
import userAuthReducer from "./slices/userAuthSlice";

const rootReducer = combineReducers({
  products: productReducer,
  userAuth: userAuthReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userAuth"], // persist only auth
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
