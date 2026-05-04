import axios, { AxiosInstance } from 'axios';
import { apiEndpoints } from './endpoints';

const BASE_URL = process.env.NEXT_PUBLIC_BITE_BREW_API_URL ?? 'http://localhost:7000/api/v1/bite-brew';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
export { apiEndpoints };
