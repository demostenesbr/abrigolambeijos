const ADMIN_AUTH_KEY = "admin_authenticated";

export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function signInAdmin() {
  localStorage.setItem(ADMIN_AUTH_KEY, "true");
}

export function signOutAdmin() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
}