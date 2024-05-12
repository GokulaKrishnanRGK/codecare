import User from "../../app/models/user.js";
import Event from "../../app/models/event.js";
import Vaccination from "../../app/models/vaccination.js";

export async function seedUser(overrides = {}) {
  const u = await User.create({
    clerkUserId: overrides.clerkUserId ?? "clerk_test_1",
    username: overrides.username ?? "test@example.com",
    firstname: overrides.firstname ?? "Test",
    lastname: overrides.lastname ?? "User",
    role: overrides.role ?? "USER",
    emailSubscribed: overrides.emailSubscribed ?? true,
    vaccinations: overrides.vaccinations ?? [],
  });
  return u.toObject();
}

export async function seedVaccination(overrides = {}) {
  const v = await Vaccination.create({
    name: overrides.name ?? "Hepatitis B",
    description: overrides.description ?? "HepB vaccine",
  });
  return v.toObject();
}

export async function seedEvent(overrides = {}) {
  const e = await Event.create({
    type: overrides.type ?? "Blood Donation Camp",
    title: overrides.title ?? "Test Event",
    organizer: overrides.organizer ?? "Org",
    description: overrides.description ?? "Desc",
    date: overrides.date ?? new Date(Date.now() + 24 * 60 * 60 * 1000), // future by default
    contactInfo: overrides.contactInfo ?? "1234567890",
    eventImage: overrides.eventImage ?? "events/test.png",
    location: overrides.location ?? {
      address: "1 Main St",
      city: "X",
      state: "Y",
      country: "USA",
      postalCode: "12345",
    },
    registeredUsers: overrides.registeredUsers ?? [],
    attendedUsers: overrides.attendedUsers ?? [],
  });
  return e.toObject();
}
