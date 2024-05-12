import request from "supertest";
import {createApp} from "../../app/createApp.js";

const app = createApp();

export function api() {
  const agent = request(app);
  return {
    get: (url, opts = {}) => withAuth(agent.get(url), opts),
    post: (url, opts = {}) => withAuth(agent.post(url), opts),
    put: (url, opts = {}) => withAuth(agent.put(url), opts),
    delete: (url, opts = {}) => withAuth(agent.delete(url), opts),
  };
}

function withAuth(req, {clerkUserId, userDbId} = {}) {
  if (clerkUserId) {
    req.set("x-test-clerk-user-id", clerkUserId);
  }
  if (userDbId) {
    req.set("x-test-user-id", userDbId);
  }
  return req;
}
