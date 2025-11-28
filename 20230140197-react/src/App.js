import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import PresensiPage from "./components/PresensiPage";
import RegisterPage from "./components/RegisterPage";
import ReportPage from "./components/ReportPage";

function App() {
  const location = useLocation();

  // Hide navbar on login & register
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Pages */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/presensi" element={<PresensiPage />} />
        <Route path="/reports" element={<ReportPage />} />
      </Routes>
    </div>
  );
}

export default App;
