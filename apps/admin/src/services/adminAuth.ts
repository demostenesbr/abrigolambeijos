export const ACCESS_TOKEN_KEY = "abrigo_access_token";
export const USER_KEY = "abrigo_user";

export interface AdminUser {
  id: number;
  email: string;
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
}

export function signOutAdmin() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("admin_authenticated");
}