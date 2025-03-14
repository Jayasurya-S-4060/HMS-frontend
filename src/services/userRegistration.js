import axiosInstance from "../api/axiosInstance";

async function registerUser(params) {
  try {
    const response = await axiosInstance.post("/api/auth/register", params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
}

export default registerUser;
