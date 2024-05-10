import {Status} from "../../constants/eventStatus-enum.ts";

export type EventStatusFilter = Status.ALL | Status.UPCOMING | Status.COMPLETE;

export interface EventSearchParams {
  keyword?: string;
  eventStatus?: EventStatusFilter;
  location?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
}
