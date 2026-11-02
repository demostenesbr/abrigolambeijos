"use client";

import { useEffect, useState } from "react";
import { authService, type AuthResponse } from "../services/auth";

export type SessionUser = AuthResponse["user"];

// Perfis administrativos não aparecem no site público.
export function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const sync = () => {
      const stored = authService.getUser();
      setUser(stored && stored.role !== "ADMIN" ? stored : null);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("abrigo-auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("abrigo-auth-changed", sync);
    };
  }, []);

  return user;
}
