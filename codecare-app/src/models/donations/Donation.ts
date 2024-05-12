export type DonationStatus = "PENDING" | "PAID" | "FAILED" | "CANCELED";

export interface DonationUser {
  username: string | null;
  firstname: string;
  lastname: string;
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  status: DonationStatus;
  paidAt?: string | null;
  user?: DonationUser | null;
}
