import axiosInstance from "../api/axiosInstance";

const createFinancialRecord = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/financial`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating record:", error);
    throw error;
  }
};
export default createFinancialRecord;
