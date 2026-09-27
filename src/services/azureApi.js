import axios from "axios";

const API_URL = "http://localhost:5001";

export const getVMs = async () => {
  const response = await axios.get(`${API_URL}/api/vms`);
  return response.data;
};

export const getResources = async () => {
  const response = await axios.get(`${API_URL}/api/resources`);
  return response.data;
};

export const getStorage = async () => {
  const response = await axios.get(`${API_URL}/api/storage`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/api/dashboard`);
  return response.data;
};