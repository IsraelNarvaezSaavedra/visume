import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { PublicCVPage } from "./pages/index.ts";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cv/:shareCode" element={<PublicCVPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);