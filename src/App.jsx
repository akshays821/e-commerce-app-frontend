import { Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./redux/store";

import Home from "./pages/Home";
import Chatbot from "./components/Chatbot";
import UserSignup from "./pages/UserSignup"
import VerifyEmail from "./pages/VerifyEmail";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserLogin from "./pages/UserLogin";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import { useAuthCheck } from "./hooks/useAuthCheck";
import BannedAccountModal from "./components/BannedAccountModal";
import GlobalModal from "./components/GlobalModal";

function AppContent() {
  useAuthCheck();
  const location = useLocation();

  const hideChatbot =
    location.pathname === "/login" ||
    location.pathname === "/admin/login";

  return (
    <>
      <BannedAccountModal />
      <GlobalModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />


        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      {!hideChatbot && <Chatbot />}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
