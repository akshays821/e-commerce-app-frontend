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
            duration: 3500,
            style: {
              background: "#111",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 16px",
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
