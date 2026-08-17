// URL pública del backend en la Raspberry Pi (vía Cloudflare Tunnel).
export const API_BASE_URL = "https://pilotpsych-api.star-crew.es";

export const isApiConfigured = !API_BASE_URL.includes("AQUI");
