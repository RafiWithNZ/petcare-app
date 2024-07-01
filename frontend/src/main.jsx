import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ToastContainer
          theme="colored"
          position="bottom-center"
          autoClose={1000}
          pauseOnHover
          draggable
        />
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
