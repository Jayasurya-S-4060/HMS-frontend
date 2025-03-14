import axiosInstance from "../api/axiosInstance";

const getFinancialRecords = async () => {
  try {
    const res = await axiosInstance.get("/api/financial");
    return res.data;
  } catch (error) {
    console.error("Error fetching financial records:", error);
    throw error;
  }
};

export default getFinancialRecords;
