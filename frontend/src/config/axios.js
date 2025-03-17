import axios from 'axios';
import { server } from './index';

const axiosInstance = axios.create({
  baseURL: server,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

export default axiosInstance; 