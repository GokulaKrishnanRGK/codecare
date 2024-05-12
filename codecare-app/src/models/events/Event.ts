export default interface Event {
  id: string;
  type: string;
  title: string;
  organizer: string;
  description: string;
  date: string;
  endTime: string;
  contactInfo: string;
  eventImage: string;
  location: Location;
  registeredCount: number;
  attendedCount: number;
  isRegistered: boolean;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}
