import axiosInstance from "../api/axiosInstance";

const updateFinancialRecord = async (id, data) => {
  try {
    await axiosInstance.put(`/api/financial/${id}`, data);
  } catch (error) {
    console.error("Error updating financial record:", error);
    throw error;
  }
};

export default updateFinancialRecord;
