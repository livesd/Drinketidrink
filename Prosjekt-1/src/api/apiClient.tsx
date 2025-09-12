import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE;
const apiKey = import.meta.env.VITE_API_NINJAS_KEY;

if (!baseURL) throw new Error("Mangler VITE_API_BASE i .env");
if (!apiKey) throw new Error("Mangler VITE_API_NINJAS_KEY i .env");


export const api = axios.create({
    baseURL,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    config.headers = config.headers ?? {};
    (config.headers as any)["X-Api-Key"] = apiKey;
    (config.headers as any)["Accept"] = "application/json";
    return config;
});

// feilmeldigner
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;
        const message = 
            err.response?.data?.error ??
            err.response?.data?.message ??
            err.message ??
            "En ukjent feil oppsto";
        
        const e = new Error(message) as Error & {status?: number};
        e.status = status;
        return Promise.reject(e);
    }
);
