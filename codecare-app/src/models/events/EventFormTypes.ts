export interface EventLocationForm {
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
  endTime: string;
  contactInfo: string;
  eventImage: string;
  location: EventLocationForm;
}

export type EventFormMode = "create" | "edit";