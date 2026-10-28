import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import KavuDetails from "./pages/KavuDetails.jsx";
import "./index.css";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ManageKavus from "./pages/ManageKavus.jsx";
import EditKavu from "./pages/EditKavu.jsx";
import EventSubmissions from "./pages/EventSubmissions.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<App />} />

  <Route path="/kavu/:id" element={<KavuDetails />} />

  <Route path="/admin/login" element={<AdminLogin />} />

  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
  <Route
  path="/admin/kavus"
  element={
    <ProtectedRoute>
      <ManageKavus />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/kavus/:id/edit"
  element={
    <ProtectedRoute>
      <EditKavu />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/submissions"
  element={
    <ProtectedRoute>
      <EventSubmissions />
    </ProtectedRoute>
  }
/>
</Routes>
    </BrowserRouter>
  </StrictMode>
);