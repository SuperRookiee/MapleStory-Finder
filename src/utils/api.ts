import axios from "axios";
import { userStore } from "@/stores/userStore";

export const api = axios.create({
  baseURL: "https://open.api.nexon.com/maplestory/v1",
});

api.interceptors.request.use((config) => {
  const apiKey =
    userStore.getState().user.apiKey || process.env.NEXT_PUBLIC_NEXON_API_KEY;
  if (apiKey) {
    config.headers = config.headers ?? {};
    config.headers["x-nxopen-api-key"] = apiKey;
  }
  return config;
});
