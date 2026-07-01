import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RoleSelection from "./components/RoleSelection";
import Navbar from "./components/Navbar";
import { AuthContext } from "./utils/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const AppContent = ({ accessToken, userData, handleLogout }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <div className="min-h-screen bg-slate-50">
      {!hideNavbar && (
        <Navbar
          isAuthenticated={Boolean(accessToken)}
          role={userData?.role || localStorage.getItem("userRole")}
          onLogout={handleLogout}
        />
      )}
      <main className={hideNavbar ? "" : "pt-20"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || "");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        setUserData(null);
        return;
      }

      try {
        const result = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        setUserData(result.data?.user || null);
        if (result.data?.user?.role) {
          localStorage.setItem("userRole", result.data.user.role);
        }
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };

    fetchProfile();
  }, [accessToken]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    setAccessToken("");
    setUserData(null);
  };

  const authContextValue = useMemo(
    () => ({
      accessToken,
      setAccessToken,
      userData,
      setUserData,
      loading,
      setLoading,
    }),
    [accessToken, userData, loading]
  );

  return (    <AuthContext.Provider value={authContextValue}>
      <BrowserRouter>
        <AppContent
          accessToken={accessToken}
          userData={userData}
          handleLogout={handleLogout}
        />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
