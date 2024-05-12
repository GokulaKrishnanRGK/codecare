import { api } from "./setup/request.js";
import User from "../app/models/user.js";
import Vaccination from "../app/models/vaccination.js";

function unwrapData(body) {
  return body?.data ?? body;
}

async function seedAdminUser() {
  const admin = await User.create({
    clerkUserId: "clerk_test_admin_edit_1",
    username: "admin_edit@test.com",
    firstname: "Admin",
    lastname: "Edit",
    role: "ADMIN",
  });

  return {
    adminDbId: String(admin._id),
    clerkUserId: admin.clerkUserId,
  };
}

describe("Admin Vaccinations API - update", () => {
  it("PUT /api/admin/vaccinations/:id updates name/description", async () => {
    const { clerkUserId, adminDbId } = await seedAdminUser();

    const created = await Vaccination.create({
      name: "Old Name",
      description: "Old Desc",
    });

    const res = await api()
    .put(`/api/admin/vaccinations/${created._id}`, { clerkUserId, userDbId: adminDbId })
    .send({ name: "New Name", description: "New Desc" })
    .expect(200);

    const payload = unwrapData(res.body);

    expect(payload.name).toBe("New Name");
    expect(payload.description).toBe("New Desc");

    const db = await Vaccination.findById(created._id).lean().exec();
    expect(db.name).toBe("New Name");
    expect(db.description).toBe("New Desc");
  });

  it("PUT /api/admin/vaccinations/:id rejects invalid payload (400) with zod field errors", async () => {
    const { clerkUserId, adminDbId } = await seedAdminUser();

    const created = await Vaccination.create({
      name: "Valid",
      description: "Valid",
    });

    const res = await api()
    .put(`/api/admin/vaccinations/${created._id}`, { clerkUserId, userDbId: adminDbId })
    .send({ name: "", description: "" })
    .expect(400);

    expect(res.body?.error?.message).toBe("Invalid vaccination data");
    expect(res.body?.error?.details).toBeTruthy();
  });

  it("PUT /api/admin/vaccinations/:id returns 404 if not found", async () => {
    const { clerkUserId, adminDbId } = await seedAdminUser();

    const missingId = "000000000000000000000000";
    await api()
    .put(`/api/admin/vaccinations/${missingId}`, { clerkUserId, userDbId: adminDbId })
    .send({ name: "Anything" })
    .expect(404);
  });

  it("PUT /api/admin/vaccinations/:id rejects duplicate name (409)", async () => {
    const { clerkUserId, adminDbId } = await seedAdminUser();

    const v1 = await Vaccination.create({ name: "UniqueA", description: "A" });
    await Vaccination.create({ name: "UniqueB", description: "B" });

    const res = await api()
    .put(`/api/admin/vaccinations/${v1._id}`, { clerkUserId, userDbId: adminDbId })
    .send({ name: "UniqueB" })
    .expect(409);

    expect(res.body).toBeTruthy();
  });
});
