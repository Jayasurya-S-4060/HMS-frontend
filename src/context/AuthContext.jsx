import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

const permissions = {
  Admin: [
    "hostel-management",
    "user-management",
    "notification-management",
    "payment-management",
    "financial-management",
    "user-registration",
  ],
  Resident: ["profile", "user-payments"],
  Staff: ["profile"],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/check-auth", {
          withCredentials: true,
        });

        const loggedInUser = response.data.user;
        setUser(loggedInUser);

        // Redirect based on role
        redirectUser(loggedInUser.role);
      } catch (error) {
        console.error(
          "Auth Check Failed:",
          error.response?.data || error.message
        );
        setUser(null);
        // Optionally navigate to login only if you're not already on login
        if (!window.location.pathname.includes("/auth/login")) {
          navigate("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Role based redirection
  const redirectUser = (role) => {
    switch (role) {
      case "Admin":
        navigate("/app/rooms");
        break;
      case "Resident":
      case "Staff":
        navigate("/app/myProfile");
        break;
      default:
        navigate("/auth/login");
    }
  };

  // Login function
  const login = async (params) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", params, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const loggedInUser = response.data.user;
      setUser(loggedInUser);

      redirectUser(loggedInUser.role);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed, please try again",
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        permissions,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
