import type {ResponseObject} from "../models/ResponseObject";
import {post} from "./api-service";

interface DonateResponse {
  url: string;
}

interface DonateRequest {
  amount: number;
}

export const donate = async (
    form: FormData
): Promise<ResponseObject<DonateResponse>> => {
  const amount = Number(form.get("amount"));

  return post<DonateResponse, DonateRequest>(
      "donations/checkout",
      {amount}
  );
};
