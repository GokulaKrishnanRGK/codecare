import { api } from "./setup/request.js";

import User from "../app/models/user.js";
import Vaccination from "../app/models/vaccination.js";

function unwrapData(body) {
  return body?.data ?? body;
}

async function seedAdminUser() {
  const admin = await User.create({
    clerkUserId: "clerk_test_admin_1",
    username: "admin@test.com",
    firstname: "Admin",
    lastname: "User",
    role: "ADMIN",
  });

  return {
    adminDbId: String(admin._id),
    clerkUserId: admin.clerkUserId,
  };
}

describe("Admin Vaccinations API", () => {
  it("GET /api/admin/vaccinations returns paginated list", async () => {
    const { clerkUserId, adminDbId } = await seedAdminUser();

    await Vaccination.create([
      { name: "Hepatitis B", description: "Hep B vaccination" },
      { name: "MMR", description: "Measles, Mumps, Rubella" },
    ]);

    const res = await api()
    .get("/api/admin/vaccinations?page=1", { clerkUserId, userDbId: adminDbId })
    .expect(200);

    const payload = unwrapData(res.body);

    expect(payload).toBeTruthy();
    expect(Array.isArray(payload.items)).toBe(true);
    expect(payload.items.length).toBeGreaterThan(0);

    const first = payload.items[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("description");

    expect(payload).toHaveProperty("page");
    expect(payload).toHaveProperty("totalPages");
    expect(payload).toHaveProperty("total");
  });

  it("POST /api/admin/vaccinations creates a vaccination", async () => {
    const { clerkUserId, adminDbId } = await seedAdminUser();

    const res = await api()
    .post("/api/admin/vaccinations", { clerkUserId, userDbId: adminDbId })
    .send({ name: "Tetanus", description: "Tetanus vaccine" })
    .expect(200);

    const payload = unwrapData(res.body);

    expect(payload).toBeTruthy();
    expect(payload).toHaveProperty("id");
    expect(payload.name).toBe("Tetanus");
    expect(payload.description).toBe("Tetanus vaccine");

    const db = await Vaccination.findById(payload.id).lean().exec();
    expect(db).toBeTruthy();
    expect(db.name).toBe("Tetanus");
  });

  it("POST /api/admin/vaccinations rejects missing name/description (400)", async () => {
    const { clerkUserId, adminDbId } = await seedAdminUser();

    const res1 = await api()
    .post("/api/admin/vaccinations", { clerkUserId, userDbId: adminDbId })
    .send({ description: "Missing name" })
    .expect(400);

    expect(res1.body).toBeTruthy();

    const res2 = await api()
    .post("/api/admin/vaccinations", { clerkUserId, userDbId: adminDbId })
    .send({ name: "HasName" })
    .expect(400);

    expect(res2.body).toBeTruthy();
  });

  it("POST /api/admin/vaccinations rejects duplicate name (409)", async () => {
    const { clerkUserId, adminDbId } = await seedAdminUser();

    await Vaccination.create({ name: "Polio", description: "Polio vaccine" });

    const res = await api()
    .post("/api/admin/vaccinations", { clerkUserId, userDbId: adminDbId })
    .send({ name: "Polio", description: "Duplicate" })
    .expect(409);

    expect(res.body).toBeTruthy();
  });
});
