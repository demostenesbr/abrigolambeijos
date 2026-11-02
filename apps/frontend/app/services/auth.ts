import { api } from "./api";

export interface AuthResponse {
  accessToken: string;
  user: { id: number; email: string; role: string };
}

const TOKEN_KEY = "abrigo_access_token";
const USER_KEY = "abrigo_user";
const ACTIVITY_KEY = "abrigo_last_activity";

// Tempo máximo de inatividade antes de encerrar a sessão (30 min).
export const IDLE_LIMIT_MS = 30 * 60 * 1000;

function tokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function idleExpired(): boolean {
  const last = Number(localStorage.getItem(ACTIVITY_KEY));
  return !last || Date.now() - last > IDLE_LIMIT_MS;
}

function persist(session: AuthResponse) {
  localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
  localStorage.setItem(TOKEN_KEY, session.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  window.dispatchEvent(new Event("abrigo-auth-changed"));
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
  // Retorna null (e limpa a sessão) se o token expirou ou houve inatividade.
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    if (tokenExpired(token) || idleExpired()) {
      authService.logout();
      return null;
    }
    return token;
  },
  touch() {
    if (localStorage.getItem(TOKEN_KEY)) {
      localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
    }
  },
  getUser(): AuthResponse["user"] | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw && authService.getToken() ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  updateStoredUser(user: AuthResponse["user"]) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("abrigo-auth-changed"));
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    window.dispatchEvent(new Event("abrigo-auth-changed"));
  },
};

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Não foi possível conectar ao servidor.";
}
