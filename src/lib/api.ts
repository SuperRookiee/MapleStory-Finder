import axios from "axios";
import { useApiKeyStore } from "@/store/apiKeyStore";

export const api = axios.create({
  baseURL: "https://open.api.nexon.com/maplestory/v1",
});

api.interceptors.request.use((config) => {
  const apiKey = useApiKeyStore.getState().apiKey;
  if (apiKey) {
    config.headers = config.headers ?? {};
    config.headers["x-nxopen-api-key"] = apiKey;
  }
  return config;
});
