import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { EnquiryProvider } from "./context/EnquiryContext";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <EnquiryProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </EnquiryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
