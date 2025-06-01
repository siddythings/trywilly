import axios from "axios";

const apiInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  // timeout: 10000,
});

// Add request interceptor to include authentication token in requests
apiInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user.data?.access_token;
      
      // If token exists, add it to the request headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error adding auth token to request:", error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;