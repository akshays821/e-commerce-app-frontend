import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />

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
