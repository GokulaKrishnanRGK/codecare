import {StatusCodes} from "http-status-codes";
import {
  createVaccinationBodySchema,
  updateVaccinationBodySchema,
} from "@codecare/validation";

const toFieldErrors = (zodError) => zodError.flatten().fieldErrors;

export function validateVaccinationRequest({req, res, mode}) {
  const schema = mode === "create" ? createVaccinationBodySchema
      : updateVaccinationBodySchema;

  const candidate = {
    name: req.body?.name,
    description: req.body?.description,
  };

  const parsed = schema.safeParse(candidate);

  if (!parsed.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Invalid vaccination data",
        details: toFieldErrors(parsed.error)
      },
    });
    return {ok: false};
  }

  const data = {
    ...(parsed.data.name !== undefined ? {name: parsed.data.name.trim()} : {}),
    ...(parsed.data.description !== undefined
        ? {description: parsed.data.description.trim()} : {}),
  };

  return {ok: true, data};
}
