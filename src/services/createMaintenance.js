import axiosInstance from "../api/axiosInstance";

const createMaintenance = async (body) => {
  await axiosInstance.post(`/api/maintenanceRequest`, body);
};

export default createMaintenance;
