import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/* Wrap your app with GoogleOAuthProvider */}
        {/* Make sure VITE_GOOGLE_CLIENT_ID is in your frontend .env file */}
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(30, 41, 59, 0.8)", // Slate-800 with opacity
              backdropFilter: "blur(12px)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "16px 20px",
              fontSize: "15px",
              fontWeight: "500",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
              maxWidth: "400px",
            },
            success: {
              iconTheme: {
                primary: "#4ade80",
                secondary: "rgba(30, 41, 59, 1)",
              },
              style: {
                border: "1px solid rgba(74, 222, 128, 0.2)",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "rgba(30, 41, 59, 1)",
              },
              style: {
                border: "1px solid rgba(248, 113, 113, 0.2)",
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
