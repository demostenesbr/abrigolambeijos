"use client";

import { useEffect, useState } from "react";
import { statsService, type PublicStats } from "../../services/stats";

const PLACEHOLDER = "—";

const formatCount = (value: number | undefined, plus = false) =>
  value === undefined
    ? PLACEHOLDER
    : `${value.toLocaleString("pt-BR")}${plus && value > 0 ? "+" : ""}`;

export function usePublicStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    let active = true;
    statsService
      .getPublicStats()
      .then((data) => active && setStats(data))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return {
    rescued: formatCount(stats?.rescuedAnimals, true),
    adoptions: formatCount(stats?.adoptions, true),
    partners: formatCount(stats?.activePartners),
    raised: stats
      ? stats.totalRaised.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
          maximumFractionDigits: 0,
        })
      : PLACEHOLDER,
    raisedLabel: !stats
      ? "Total arrecadado"
      : stats.totalRaisedPeriod === "recent"
        ? `Arrecadado nos últimos ${stats.totalRaisedMonths} meses`
        : "Total arrecadado desde o início",
  };
}
