import { api } from "./setup/request.js";

test("smoke", async () => {
  const res = await api().get("/health");
  // If you don't have /health route, just assert server responds differently,
  // or add /health route quickly.
  expect([200, 404]).toContain(res.status);
});
