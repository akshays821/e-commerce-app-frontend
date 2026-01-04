import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Chatbot from "./components/Chatbot";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      <Chatbot />
    </>
  );
}

export default App;
