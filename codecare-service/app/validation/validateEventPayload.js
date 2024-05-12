import { StatusCodes } from "http-status-codes";
import { createEventBodySchema, updateEventBodySchema } from "@codecare/validation";
import { setErrorResponseMsg } from "../utils/response-handler.js";

const toFieldErrors = (zodError) => zodError.flatten().fieldErrors;

function safeJsonParse(value) {
  if (value === undefined || value === null) return { ok: true, value: undefined };
  if (typeof value === "object") return { ok: true, value };
  if (typeof value !== "string") return { ok: false };
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch {
    return { ok: false };
  }
}

export function validateEventRequest({ req, res, mode }) {
  const schema = mode === "create" ? createEventBodySchema : updateEventBodySchema;

  if (mode === "create" && !req.file) {
    setErrorResponseMsg("Event image is required", res, StatusCodes.BAD_REQUEST);
    return { ok: false };
  }

  let location;
  if (req.body?.location !== undefined) {
    const parsed = safeJsonParse(req.body.location);
    if (!parsed.ok) {
      setErrorResponseMsg("Invalid location payload", res, StatusCodes.BAD_REQUEST);
      return { ok: false };
    }
    location = parsed.value;
  }

  const candidate = {
    type: req.body?.type,
    title: req.body?.title,
    organizer: req.body?.organizer,
    description: req.body?.description,
    contactInfo: req.body?.contactInfo,
    date: req.body?.date,
    endTime: req.body?.endTime,
    ...(req.body?.location !== undefined ? { location } : {}),
  };

  const parsed = schema.safeParse(candidate);
  if (!parsed.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: { message: "Invalid event data", details: toFieldErrors(parsed.error) },
    });
    return { ok: false };
  }

  const data = { ...parsed.data };
  if (data.date) data.date = new Date(data.date);
  if (data.endTime) data.endTime = new Date(data.endTime);
  return { ok: true, data };
}
