import axios, { AxiosError } from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  // We don't need to manually attach tokens because we use httpOnly cookies
  // which are automatically sent by the browser to the same domain.
  withCredentials: true,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Logic for 401:
      // If we are not on the login page, we might want to redirect.
      // However, client-side redirects should be handled by the component/context consuming this.
      // Here we just ensure the error is passed through clearly.
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        // Optional: Force reload or event emit if needed,
        // but Context -> useEffect is cleanest.
      }
    }

    // Standardize error message
    // Axios wraps response in 'response.data', our API returns { error: 'message' }
    const responseData = error.response?.data as { error?: string } | undefined;
    const message =
      responseData?.error || error.message || "Something went wrong";

    // Attach readable message to error object
    error.message = message;

    return Promise.reject(error);
  },
);

export default apiClient;
