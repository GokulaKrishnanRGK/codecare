import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {Donation} from "../../models/donations/Donation.ts";

export interface ApiResponse<T> {
  data: T;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

type ErrorShape = {
  error?: { message?: string };
  message?: string;
};

export interface DonationsAdminResponse extends Paginated<Donation> {
  totalAmount: number;
}

export type DonationSortBy = "amount" | "paidAt";
export type DonationSortDir = "asc" | "desc";
export type DonationFilterStatus = "ALL" | "PENDING" | "PAID" | "FAILED" | "CANCELED";

export interface GetDonationsParams {
  page: number;
  status?: DonationFilterStatus;
  sortBy?: DonationSortBy;
  sortDir?: DonationSortDir;
}

export function getApiErrorMessage(err: unknown): string {
  const e = err as FetchBaseQueryError;
  if (e && typeof e === "object" && "status" in e) {
    const data = (e as any).data as ErrorShape | undefined;
    const msg = data?.error?.message || data?.message;
    if (msg) return msg;
    if (typeof (e as any).data === "string") return (e as any).data;
    return "Request failed";
  }
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong";
}