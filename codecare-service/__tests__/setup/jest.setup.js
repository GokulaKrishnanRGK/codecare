import {connectTestDb, clearTestDb, disconnectTestDb} from "./mongo.js";
import "./auth.mock.js";

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  process.env.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
      || "http://localhost:5173";
  process.env.UPLOAD_DIR = process.env.UPLOAD_DIR || "./userUploads_test";
  process.env.UPLOAD_PUBLIC_URL = process.env.UPLOAD_PUBLIC_URL || "/uploads";

  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
  jest.clearAllMocks();
});

afterAll(async () => {
  await disconnectTestDb();
});
