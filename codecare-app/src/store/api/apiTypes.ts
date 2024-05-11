import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";

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