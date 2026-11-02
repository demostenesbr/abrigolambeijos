// Base URL da API do backend (NestJS), configurável via .env / docker-compose
// URL do site público, onde fica a única tela de login (/entrar).
export const FRONTEND_URL: string =
  import.meta.env.VITE_FRONTEND_URL ?? "http://localhost:3000";

export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3001";

