import axiosInstance from "../api/axiosInstance";

const deleteFinancialRecord = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/financial/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting financial record:", err);
    throw new Error("Failed to delete financial record");
  }
};

export default deleteFinancialRecord;
