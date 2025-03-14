import axiosInstance from "../api/axiosInstance";

const getMaintenanceRequest = async (query) => {
  try {
    const resp = await axiosInstance.get(
      `${"/api/maintenanceRequest"}${query}`
    );
    return resp.data;
  } catch (err) {
    return err.response?.data || { message: "Something went wrong" };
  }
};

export default getMaintenanceRequest;
