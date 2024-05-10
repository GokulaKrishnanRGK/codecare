export default interface Event {
  id: string;
  type: string;
  title: string;
  organizer: string;
  description: string;
  date: string;
  contactInfo: string;
  eventStatus: string;
  eventImage: string;
  location: Location;
}

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}
