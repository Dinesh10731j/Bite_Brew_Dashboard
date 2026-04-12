import axios, { AxiosInstance} from 'axios';
import { apiEndpoints } from './endpoints';

const BASE_URL = 'http://localhost:7000/api/v1';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // For httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

export { apiEndpoints };
