import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import DonorRequests from "./pages/DonorRequests";

import Layout from "./components/Layout/Layout";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import FindDonor from "./pages/FindDonor";
import RequestBlood from "./pages/RequestBlood";
import DonateBlood from "./pages/DonateBlood";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import MyRequests from "./pages/MyRequests";
import AdminDashboard from "./pages/AdminDashboard";
import BloodRequests from "./pages/BloodRequests";
import ChatPage from "./pages/ChatPage";
import VerifyCertificate from "./pages/VerifyCertificate/VerifyCertificate";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

        <Route path="/" element={<Layout />}>

          {/* Public Pages */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="find-donor" element={<FindDonor />} />
          <Route path="request-blood" element={<RequestBlood />} />
          <Route path="donate" element={<DonateBlood />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="verify-certificate/:certId" element={<VerifyCertificate />} />

          {/* User Pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="donor-requests" element={<DonorRequests />} />
          <Route path="chat/:requestId" element={<ChatPage />} />

          {/* Admin Pages (Accessible via /admin or /admin-dashboard) */}
          <Route element={<AdminRoute />}>
            <Route
              path="admin"
              element={<AdminDashboard />}
            />
            <Route
              path="admin-dashboard"
              element={<AdminDashboard />}
            />
          </Route>

          <Route
            path="blood-requests"
            element={<BloodRequests />}
          />

          {/* Catch-all 404 fallback - redirects to home instead of blank page */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>

      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;