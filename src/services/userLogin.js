import axiosInstance from "../api/axiosInstance";

async function userLogin(params) {
  try {
    const response = await axiosInstance.post("/api/auth/login", params, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
}

export default userLogin;
