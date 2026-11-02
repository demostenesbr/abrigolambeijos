import { FRONTEND_URL } from "../config/environment";

export const ACCESS_TOKEN_KEY = "abrigo_access_token";
export const USER_KEY = "abrigo_user";

const ACTIVITY_KEY = "abrigo_last_activity";

// Tempo máximo de inatividade antes de encerrar a sessão (30 min).
export const IDLE_LIMIT_MS = 30 * 60 * 1000;

export function touchAdminSession() {
  localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
}

export function isAdminSessionExpired() {
  const last = Number(localStorage.getItem(ACTIVITY_KEY));
  return !last || Date.now() - last > IDLE_LIMIT_MS;
}

export interface AdminUser {
  id: number;
  email: string;
  name?: string | null;
  role: string;
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as AdminUser;
  } catch {
    return null;
  }
}

export function persistAdminSession(session: {
  accessToken: string;
  user: AdminUser;
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  touchAdminSession();
}

export function redirectToLogin(expired = false) {
  window.location.replace(
    `${FRONTEND_URL}/entrar${expired ? "?sessao=expirada" : ""}`,
  );
}

export function signOutAdmin() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("admin_authenticated");
  localStorage.removeItem(ACTIVITY_KEY);
}