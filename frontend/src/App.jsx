import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AgentDashboard from "./components/AgentDashboard";
import { LeadsProvider } from "./context/LeadsContext";
import API from "./services/api";
import toast from "react-hot-toast";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || !role) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        await API.get("/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLoggedIn(true);
        setUserRole(role);
      } catch (err) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <LeadsProvider>
      <Toaster position="top-center" reverseOrder={false} />
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : userRole === "admin" ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <AgentDashboard onLogout={() => setIsLoggedIn(false)} />
      )}
    </LeadsProvider>
  );
}

export default App;
