export interface ErrorPayload {
  message: string;
  data?: unknown;
}

export interface ResponseObject<T> {
  status: number;
  message?: string;
  data?: T;
  error?: ErrorPayload;
}
