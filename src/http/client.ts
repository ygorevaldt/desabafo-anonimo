import axios from "axios";
import { rateLimitAlert, serviceUnavailableAlert } from "@/utils/alert";

export const httpClient = axios.create({
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response) {
      if (error.response.status === 429) {
        rateLimitAlert(error.response.data?.retryAfterSeconds);
      } else if (error.response.status === 503) {
        serviceUnavailableAlert();
      }
    }
    return Promise.reject(error);
  },
);
