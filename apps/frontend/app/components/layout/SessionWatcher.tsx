"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "../../services/auth";

const PROTECTED_PATHS = ["/recomendacao", "/perfil"];
const CHECK_INTERVAL_MS = 30 * 1000;
const ACTIVITY_THROTTLE_MS = 15 * 1000;
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"];

// Renova a atividade, encerra sessões expiradas/ociosas e protege as rotas privadas.
export default function SessionWatcher() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isProtected = PROTECTED_PATHS.some((path) =>
      pathname.startsWith(path),
    );

    const verify = () => {
      const hadSession = Boolean(localStorage.getItem("abrigo_access_token"));
      if (authService.getToken()) return;
      if (isProtected) {
        router.replace(hadSession ? "/entrar?sessao=expirada" : "/entrar");
      }
    };

    let lastTouch = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - lastTouch < ACTIVITY_THROTTLE_MS) return;
      lastTouch = now;
      if (authService.getToken()) authService.touch();
    };

    verify();
    const timer = window.setInterval(verify, CHECK_INTERVAL_MS);
    window.addEventListener("abrigo-auth-changed", verify);
    window.addEventListener("storage", verify);
    ACTIVITY_EVENTS.forEach((name) =>
      window.addEventListener(name, onActivity, { passive: true }),
    );

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("abrigo-auth-changed", verify);
      window.removeEventListener("storage", verify);
      ACTIVITY_EVENTS.forEach((name) =>
        window.removeEventListener(name, onActivity),
      );
    };
  }, [pathname, router]);

  return null;
}
