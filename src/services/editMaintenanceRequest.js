import axiosInstance from "../api/axiosInstance";

const editMaintenanceRequest = async (id, body) => {
  await axiosInstance.put(`/api/maintenanceRequest/${id}`, body);
};

export default editMaintenanceRequest;
