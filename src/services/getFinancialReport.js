import axios from "axios";

const generateFinancialReport = async () => {
  try {
    const res = await axios.get("/api/financial/report");
    return res.data;
  } catch (error) {
    console.error("Error generating financial report:", error);
    throw error;
  }
};

export default generateFinancialReport;
