import axios from 'axios';

// declare global {
//   module 'axios' {
//     export interface AxiosResponse<T = any> extends Promise<T> {}
//   }

// }
const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'http://funiverse.world:30000',
  // baseURL: 'http://dev.funiverse.world/api',
  proxy: {
    host: 'http://localhost',
    port: 3001,
  },
  // proxy: {
  //   // protocol: 'http',
  //   host: 'http://localhost',
  //   port: 3001,
  //   // auth: {
  //   //   username: 'mikeymike',
  //   //   password: 'rapunz3l'
  //   // }
  // },
});
axiosClient.interceptors.response.use((response) => {
  return response?.data;
});

export default axiosClient;
