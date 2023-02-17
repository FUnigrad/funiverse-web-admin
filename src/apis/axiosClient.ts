import axios from 'axios';

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'https://localhost:3000',
});
axiosClient.interceptors.response.use((response) => {
  return response?.data;
});

export default axiosClient;
