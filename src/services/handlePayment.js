import axiosInstance from "../api/axiosInstance";

const createPaymentIntent = async ({
  costItems,
  currency = "usd",
  roomHistoryId,
}) => {
  try {
    const response = await axiosInstance.post("/api/payments/create-intent", {
      costItems,
      currency,
      roomHistoryId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error.response?.data || { error: "Payment request failed" };
  }
};

const getUserPayments = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/payments/user-payments/${userId}`
    );
    return response.data; // Return user payment list
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return [];
  }
};

const getAllPayments = async () => {
  try {
    const response = await axiosInstance.get("/api/payments");
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error.response?.data || { error: "Failed to fetch payments" };
  }
};

export { createPaymentIntent, getUserPayments, getAllPayments };
