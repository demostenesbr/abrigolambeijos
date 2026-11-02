import { api } from "./api";

export interface PublicStats {
  rescuedAnimals: number;
  adoptions: number;
  activePartners: number;
  totalRaised: number;
  totalRaisedPeriod: "recent" | "all_time";
  totalRaisedMonths: number;
}

export interface DonationSummary {
  totalAmount: number;
  donationsCount: number;
  donorsCount: number;
}

export interface PublicPartner {
  id: number;
  name: string;
  type: string;
  city: string;
  state: string;
  description: string;
}

export const statsService = {
  getPartners: () => api.get<PublicPartner[]>("/partners/public"),
  getPublicStats: () => api.get<PublicStats>("/stats"),
  getDonationSummary: () => api.get<DonationSummary>("/donations/summary"),
};
