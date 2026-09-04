import axios from "axios";

const baseURL = import.meta.env.VITE_APP_BACKEND_URL || "/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export class ApiError extends Error {
  status?: number;
  errors?: string[];

  constructor(message: string, status?: number, errors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      throw new ApiError(
        message,
        error.response?.status,
        error.response?.data?.errors,
      );
    }

    throw error;
  },
);

export default api;
