import { api } from "./api";

export interface AuthResponse {
  accessToken: string;
  user: { id: number; email: string; role: string };
}

const TOKEN_KEY = "abrigo_access_token";
const USER_KEY = "abrigo_user";

function persist(session: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, session.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export const authService = {
  async login(email: string, password: string) {
    const session = await api.post<AuthResponse>("/auth/login", { email, password });
    persist(session);
    return session;
  },
  async register(data: { name: string; email: string; password: string }) {
    const session = await api.post<AuthResponse>("/auth/register", data);
    persist(session);
    return session;
  },
  getToken: () =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Não foi possível conectar ao servidor.";
}
