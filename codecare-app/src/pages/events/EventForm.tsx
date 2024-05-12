import {useEffect, useMemo, useRef, useState} from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Input,
} from "@mui/material";

import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

import dayjs from "dayjs";
import {Controller, useForm, type Resolver} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import type {EventFormMode, EventFormState} from "../../models/events/EventFormTypes";
import {
  createEventClientSchema,
  updateEventClientSchema,
  type EventFormValues,
} from "@codecare/validation";

import {toPublicImageUrl} from "../../utils/image-url";

const EVENT_TYPES: readonly string[] = [
  "General Health Checkup Camp",
  "Vaccination Camp",
  "Blood Donation Camp",
  "Dental Camp",
  "Eye Care Camp",
  "Diabetes Screening Camp",
  "Cancer Screening Camp",
  "Orthopedic Camp",
  "Pediatric Camp",
  "Women's Health Camp",
];

interface EventFormProps {
  mode: EventFormMode;
  initialValue: EventFormState;
  submitLabel: string;
  disabled?: boolean;
  onSubmit: (value: EventFormState) => Promise<void> | void;
  onFileChange?: (file: File | null) => void;
}

type FormValues = EventFormValues & { eventImage?: File };

function safeIso(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function toEventFormState(values: FormValues): EventFormState {
  return {
    type: values.type,
    title: values.title,
    organizer: values.organizer,
    description: values.description,
    contactInfo: values.contactInfo,
    date: values.date,
    endTime: values.endTime,
    eventImage: "",
    location: values.location,
  };
}

const MAX_UPLOAD_MB = 10;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;
const large_file_err = `File too large. Max upload size is ${MAX_UPLOAD_MB}MB.`;

export default function EventForm(props: Readonly<EventFormProps>): JSX.Element {
  const {mode, initialValue, submitLabel, disabled = false, onSubmit} = props;

  const currentBlobUrlRef = useRef<string | null>(null);

  const existingImageUrl = useMemo(() => {
    const url = toPublicImageUrl(initialValue.eventImage);
    return url ?? null;
  }, [initialValue.eventImage]);

  const [previewSrc, setPreviewSrc] = useState<string | null>(existingImageUrl);

  useEffect(() => {
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }
    setPreviewSrc(existingImageUrl);
  }, [existingImageUrl]);

  useEffect(() => {
    return () => {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
    };
  }, []);

  const defaultValues: FormValues = useMemo(
      () => ({
        type: initialValue.type,
        title: initialValue.title,
        organizer: initialValue.organizer,
        description: initialValue.description,
        contactInfo: initialValue.contactInfo,
        date: safeIso(initialValue.date),
        endTime: safeIso(initialValue.endTime),
        location: initialValue.location,
        eventImage: undefined,
      }),
      [initialValue]
  );

  const resolver: Resolver<FormValues> = useMemo(() => {
    const schema = mode === "create" ? createEventClientSchema : updateEventClientSchema;
    return zodResolver(schema) as unknown as Resolver<FormValues>;
  }, [mode]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: {errors, isValid},
  } = useForm<FormValues>({
    resolver,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues,
  });

  const startDateIso = watch("date");
  const endTimeIso = watch("endTime");

  useEffect(() => {
    if (!startDateIso) return;
    if (endTimeIso) return;

    const start = dayjs(startDateIso);
    const suggestedEnd = start.add(1, "hour");

    setValue("endTime", suggestedEnd.toISOString(), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [startDateIso, endTimeIso, setValue]);

  const submit = handleSubmit(async (values) => {
    if (mode === "create" && !values.eventImage) {
      const currentMsg = errors.eventImage?.message;
      if (currentMsg !== large_file_err) {
        setError("eventImage", {type: "required", message: "Event image is required"});
      }
      return;
    }

    await onSubmit(toEventFormState(values));
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (!file) {
      setValue("eventImage", undefined, {shouldDirty: true, shouldValidate: false});
      props.onFileChange?.(null);

      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
      setPreviewSrc(existingImageUrl);

      if (mode === "create") {
        setError("eventImage", {type: "required", message: "Event image is required"});
      } else {
        clearErrors("eventImage");
      }
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      e.target.value = "";

      setValue("eventImage", undefined, {shouldDirty: true, shouldValidate: false});
      props.onFileChange?.(null);

      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
      setPreviewSrc(existingImageUrl);

      setError("eventImage", {
        type: "validate",
        message: large_file_err,
      });
      return;
    }

    clearErrors("eventImage");
    setValue("eventImage", file, {shouldDirty: true, shouldValidate: true});
    props.onFileChange?.(file);

    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }
    const blobUrl = URL.createObjectURL(file);
    currentBlobUrlRef.current = blobUrl;
    setPreviewSrc(blobUrl);
  };

  return (
      <form onSubmit={submit}>
        <Grid container spacing={2} sx={{maxWidth: 820, mx: "auto", textAlign: "left"}}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.title} sx={{mt: 1}}>
              <FormLabel htmlFor="title" required>
                Title
              </FormLabel>
              <OutlinedInput id="title" disabled={disabled} {...register("title")} />
              <FormHelperText>{errors.title?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.description} sx={{mt: 2}}>
              <FormLabel htmlFor="description" required>
                Description
              </FormLabel>
              <OutlinedInput
                  id="description"
                  disabled={disabled}
                  multiline
                  minRows={6}
                  {...register("description")}
              />
              <FormHelperText>{errors.description?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.organizer} sx={{mt: 2}}>
              <FormLabel htmlFor="organizer" required>
                Name of the Organizer
              </FormLabel>
              <OutlinedInput id="organizer" disabled={disabled} {...register("organizer")} />
              <FormHelperText>{errors.organizer?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.contactInfo} sx={{mt: 2}}>
              <FormLabel htmlFor="contactInfo" required>
                Contact (Phone or Email)
              </FormLabel>

              <OutlinedInput
                  id="contactInfo"
                  disabled={disabled}
                  placeholder="e.g. 9876543210 or name@example.com"
                  {...register("contactInfo")}
              />

              <FormHelperText>{errors.contactInfo?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.eventImage} sx={{mt: 2}}>
              <FormLabel htmlFor="eventImage" required={mode === "create"}>
                Add Flyer
              </FormLabel>

              <Input
                  id="eventImage"
                  type="file"
                  disabled={disabled}
                  inputProps={{accept: "image/*"}}
                  onChange={handleFileChange}
              />

              <FormHelperText>{errors.eventImage?.message}</FormHelperText>

              {previewSrc && (
                  <Box sx={{mt: 1}}>
                    <img
                        src={previewSrc}
                        alt="Event flyer preview"
                        style={{
                          width: 160,
                          height: 160,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid rgba(0,0,0,0.15)",
                          display: "block",
                        }}
                    />
                  </Box>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
                control={control}
                name="type"
                render={({field}) => (
                    <FormControl fullWidth error={!!errors.type} sx={{mt: 1}}>
                      <FormLabel htmlFor="type" required>
                        Event Type
                      </FormLabel>
                      <Select {...field} id="type" disabled={disabled}>
                        {EVENT_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>
                              {t}
                            </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.type?.message}</FormHelperText>
                    </FormControl>
                )}
            />

            <FormControl fullWidth error={!!errors.date} sx={{mt: 2}}>
              <FormLabel required>Date</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    control={control}
                    name="date"
                    render={({field}) => (
                        <DateTimePicker
                            label="Event Date"
                            value={dayjs(field.value)}
                            onChange={(v) => {
                              const next = v?.toDate();
                              field.onChange(next ? next.toISOString() : field.value);
                            }}
                            disablePast
                            minDateTime={dayjs()}
                            disabled={disabled}
                            sx={{mt: 1, width: "100%"}}
                        />
                    )}
                />
              </LocalizationProvider>
              <FormHelperText>{errors.date?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.endTime} sx={{mt: 2}}>
              <FormLabel required>End Date</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    control={control}
                    name="endTime"
                    render={({field}) => (
                        <DateTimePicker
                            label="End Date"
                            value={field.value ? dayjs(field.value) : null}
                            minDateTime={startDateIso ? dayjs(startDateIso) : dayjs()}
                            onChange={(v) => {
                              const next = v?.toDate();
                              field.onChange(next ? next.toISOString() : field.value);
                            }}
                            disabled={disabled}
                            sx={{mt: 1, width: "100%"}}
                        />
                    )}
                />
              </LocalizationProvider>
              <FormHelperText>{errors.endTime?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.location?.address} sx={{mt: 2}}>
              <FormLabel required>Address</FormLabel>
              <OutlinedInput disabled={disabled} {...register("location.address")} />
              <FormHelperText>{errors.location?.address?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.location?.city} sx={{mt: 2}}>
              <FormLabel required>City</FormLabel>
              <OutlinedInput disabled={disabled} {...register("location.city")} />
              <FormHelperText>{errors.location?.city?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.location?.state} sx={{mt: 2}}>
              <FormLabel required>State</FormLabel>
              <OutlinedInput disabled={disabled} {...register("location.state")} />
              <FormHelperText>{errors.location?.state?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.location?.postalCode} sx={{mt: 2}}>
              <FormLabel required>Postal Code</FormLabel>
              <OutlinedInput
                  disabled={disabled}
                  placeholder="12345 or 12345-6789"
                  {...register("location.postalCode")}
              />
              <FormHelperText>{errors.location?.postalCode?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{mt: 1}}>
            <Button type="submit" variant="contained" disabled={disabled || !isValid}>
              {submitLabel}
            </Button>
          </Grid>
        </Grid>
      </form>
  );
}
