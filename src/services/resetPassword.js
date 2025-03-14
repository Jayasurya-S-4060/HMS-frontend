import axiosInstance from "../api/axiosInstance";

async function resetPassword(body, token) {
  try {
    await axiosInstance.post("/api/reset-password", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

export default resetPassword;
