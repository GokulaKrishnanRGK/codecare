export interface EventLocationForm {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface EventFormState {
  type: string;
  title: string;
  organizer: string;
  description: string;
  date: string;
  contactInfo: string;
  eventImage: string; //TODO: base64 (for now)
  location: EventLocationForm;
}

export type EventFormMode = "create" | "edit";