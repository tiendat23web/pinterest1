import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL, // lấy base URL từ env
  timeout: 60000,
  headers: {
    apikey: import.meta.env.VITE_API_KEY,
    "Content-Type": "application/json",
  },
});

// Request Interceptor: tự động gắn token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: xử lý dữ liệu và lỗi chung
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // chỉ trả về data
  },
  // chỉ trả về phần data
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Token hết hạn. Vui lòng đăng nhập lại.");
      } else {
        return Promise.reject(error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
